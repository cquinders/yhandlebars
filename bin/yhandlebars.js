#!/usr/bin/env node

var optimist = require("optimist")
		.usage("Precompile handlebar templates.\nUsage: $0 template ...", {
			"f": {
				"type": "string",
				"description": "Output File",
				"alias": "output"
			},
			"k": {
				"type": "string",
				"description": "Known helpers",
				"alias": "known"
			},
			"o": {
				"type": "boolean",
				"description": "Known helpers only",
				"alias": "knownOnly"
			},
			"m": {
				"type": "boolean",
				"description": "Minimize output",
				"alias": "min"
			},
			"s": {
				"type": "boolean",
				"description": "Output template function only.",
				"alias": "simple"
			},
			"r": {
				"type": "string",
				"description": "Template root. Base value that will be stripped from template names.",
				"alias": "root"
			},
			"n": {
				"type": "string",
				"description": "Namespace in which the templates object will reside under the Y instance.",
				"alias": "namespace",
				"default": "Handlebars"
			}
		})

		.check(function (argv) {
			var template = [0];
			if (!argv._.length) {
				throw "Must define at least one template or directory.";
			}

			argv._.forEach(function (template) {
				try {
					fs.statSync(template);
				} catch (err) {
					throw "Unable to open template file \"" + template + "\"";
				}
			});
		})
		.check(function (argv) {
			if (argv.simple && argv.min) {
				throw "Unable to minimze simple output";
			}
			if (argv.simple && (argv._.length !== 1 || fs.statSync(argv._[0]).isDirectory())) {
				throw "Unable to output multiple templates in simple mode";
			}
		});

var fs = require("fs"),
	Y = require("yui/handlebars"),
	basename = require("path").basename,
	uglify = require("uglify-js"),
	handlebars = Y.Handlebars,
	argv = optimist.argv,
	template = argv._[0],
	known = {},
	precompiledTemplates = [],
	moduleName = (argv.output) ? argv.output.split("/").pop().replace(".js", "") : "templates",
	outputTemplateFile = (argv.simple) ? "simple.handlebars" : "module.handlebars",
	outputTemplate,
	outputFiles = [],
	ast, output, outputRaw;


// Convert the known list into a hash
if (argv.known && !Array.isArray(argv.known)) {
	argv.known = [argv.known];
}
if (argv.known) {
	for (var i = 0, len = argv.known.length; i < len; i += 1) {
		known[argv.known[i]] = true;
	}
}

function processTemplate(template, root) {
	var path = template,
		stat = fs.statSync(path);

	if (stat.isDirectory()) {
		fs.readdirSync(template).map(function (file) {
			var path = template + "/" + file;

			if (/\.handlebars$|\.mustache$/.test(path) || fs.statSync(path).isDirectory()) {
				processTemplate(path, root || template);
			}
		});
	} else {
		var data = fs.readFileSync(path, "utf8"),
			options = {
				knownHelpers: known,
				knownHelpersOnly: argv.o
			};

		// Clean the template name
		if (!root) {
			template = basename(template);
		} else if (template.indexOf(root) === 0) {
			template = template.substring(root.length + 1);
		}
		template = template.replace(/\.handlebars$|\.mustache$/, "");
		
		precompiledTemplates.push({
			name: template,
			template: handlebars.precompile(data, options)
		});

		console.log("Compiled template " + template);
	}
}

function writeTemplatesToFile(file, content) {
	fs.writeFile(file, content, "utf8", function (err) {
		if (err) {
			throw "Error: Could not write file " + file;
		}
		console.log("Wrote " + file);
	});
}

argv._.forEach(function (template) {
	processTemplate(template, argv.root);
});

outputTemplate = fs.readFileSync(__dirname + "/../templates/" + outputTemplateFile, "utf8");

outputRaw = handlebars.render(outputTemplate, {
	namespace: argv.namespace,
	module: moduleName,
	templates: precompiledTemplates
});

if (argv.min || argv.output) {
	console.log("Minificating templates");
	output = uglify.parser.parse(outputRaw);
	output = uglify.uglify.ast_mangle(output);
	output = uglify.uglify.ast_squeeze(output);
	output = uglify.uglify.gen_code(output);
} else {
	output = outputRaw;
}

if (argv.output) {
	outputFiles.push({
		name: argv.output,
		content: outputRaw
	});

	outputFiles.push({
		name: argv.output.replace(".js", "-debug.js"),
		content: outputRaw
	});

	outputFiles.push({
		name: argv.output.replace(".js", "-min.js"),
		content: output
	});

	outputFiles.forEach(function (file) {
		writeTemplatesToFile(file.name, file.content);
	});
	
} else {
	console.log("\n" + output + "\n");
}
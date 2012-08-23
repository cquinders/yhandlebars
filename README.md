# yhandlebars

yhandlebars is a [http://www.handlebarsjs.com](handlebars.js) CLI for precompiling 
[http://http://yuilibrary.com/yui/docs/handlebars/](YUI handlebars) templates as YUI modules.
Checkout the official Handlebars docs site at [http://www.handlebarsjs.com](www.handlebarsjs.com) 
and the official YUI Handlebars docs at [http://yuilibrary.com/yui/docs/handlebars/](yuilibrary.com/yui/docs/handlebars/).

## Precompiling Templates

Handlebars allows templates to be precompiled and included as javascript
code rather than the handlebars template allowing for faster startup time.

### Installation
The precompiler script may be installed via npm using the `npm install -g yhandlebars` command.

### Usage

<pre>
Precompile handlebar templates.
Usage: yhandlebars template ...

Options:
  -f, --output     Output File                                                                [string]
  -k, --known      Known helpers                                                              [string]
  -o, --knownOnly  Known helpers only                                                         [boolean]
  -m, --min        Minimize output                                                            [boolean]
  -s, --simple     Output template function only.                                             [boolean]
  -r, --root       Template root. Base value that will be stripped from template names.       [string]
  -n, --namespace  Namespace in which the templates object will reside under the Y instance.  [string]  [default: "Handlebars"]
</pre>

#### Simple mode
If using the simple mode the precompiler will generate a single javascript method.

#### Module mode
If using the precompiler's normal mode, the resulting templates will be stored
to the `Y.Handlebars.templates` object using the relative template name sans the
extension. These templates may be executed in the same manner as templates.

##### Namespacing
To change the location where the templates object should be stored on the Y instance 
just pass a namespace argument like so `-n NS` and the templates will be stored to 
`Y.NS.templates`.

### Mustache compatible
The compiler will also precompile `*.mustache` files.

## Using templates in YUI

The templates will be wrapped in a `YUI.add(...)` call to be used as a YUI module. 
The name of the module will be the relative `-f` output file name sans the extension. 
If the `-f` argument is not given the module name will default to `templates`.

Since the module is configured to require `handlebars-base` you can simply `use` the 
module in YUI like so:

```js
YUI.use("templates", function (Y) {
	var template = Y.Handlebars.templates["template-name"],
		data = {
			"foo": "bar"
		};

	template(data); // Renders the template as a string

});
```
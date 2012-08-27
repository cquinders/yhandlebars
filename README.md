# yhandlebars

yhandlebars is a [YUI handlebars](http://yuilibrary.com/yui/docs/handlebars/) based command-line application for precompiling templates as YUI modules.
Checkout the official Handlebars docs site at [www.handlebarsjs.com](http://www.handlebarsjs.com) 
and the official YUI Handlebars docs at [yuilibrary.com/yui/docs/handlebars/](http://yuilibrary.com/yui/docs/handlebars/).

## Precompiling Templates

Handlebars allows templates to be precompiled and included as javascript
code rather than the handlebars template allowing for faster startup time.

### Installation
The precompiler script may be installed via npm using the `npm install -g yhandlebars` command.

### Usage

```terminal
Precompile handlebar templates.
Usage: yhandlebars <template> ...

Options:
  -f, --output     Output File                                                                [string]
  -k, --known      Known helpers                                                              [string]
  -o, --knownOnly  Known helpers only                                                         [boolean]
  -m, --min        Minimize output                                                            [boolean]
  -s, --simple     Output template function only.                                             [boolean]
  -r, --root       Template root. Base value that will be stripped from template names.       [string]
  -n, --namespace  Namespace in which the templates object will reside under the Y instance.  [string]  [default: "Handlebars"]
  -p, --plain      Plain module output without YUI.add(...) wrapper function.                 [boolean]
```

#### Simple mode
If using the simple mode the precompiler will generate a single javascript method.

#### Module mode
If using the precompiler's normal mode, the resulting templates will be stored
to the `Y.Handlebars.templates` object using the relative template name sans the
extension. These templates may be executed in the same manner as templates.

##### Namespacing
To change the location where the templates object should be stored on the Y instance 
just pass a namespace argument like this `-n NS` and the templates will be stored to 
`Y.NS.templates`.

### Mustache compatible
The compiler will also precompile `*.mustache` files.

## Using templates in YUI

The templates will be wrapped in a `YUI.add(...)` call to be used as a YUI module. 
The name of the module will be the relative `-f` output file name sans the extension. 
If the `-f` argument is not given the module name will default to `handlebars-templates`.

Since the module is configured to require `handlebars-base` you can simply `use` the 
module in YUI like this:

```
<!DOCTYPE html>
<meta charset="utf-8">
<title>My Favorite Food</title>

<body>
<div id="content"></div>

<script src="http://yui.yahooapis.com/3.6.0/build/yui/yui-min.js"></script>
<script>
YUI().use("handlebars-templates", "node", function (Y) {
    
    // Render the template and insert its output into the page.
    var output = Y.Handlebars.templates["my-template"]({food: "pie"});
    Y.one("#content").append(output);
});
</script>
</body>
```

## Handlebars.js

yhandlebars is a port of the [handlebarsjs](http://www.handlebarsjs.com) command-line application to [YUI handlebars](http://yuilibrary.com/yui/docs/handlebars/).
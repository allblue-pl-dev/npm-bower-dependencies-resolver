# Bower Dependencies Resolver

Bower resolver for adding external packages (i.e. git repositories, git submodules, local projects) bower dependencies.

## Description

The idea behind this resolver is to be able to use "external" `bower.json` files to define project dependencies. This way you can use multiple `bower.json` files to define dependencies or define bower dependencies in projects that you don't want to be placed in directory with bower packages.

## Usage

`bower.json`

```json
{
  "dependecies": {
    "my-git-project": "bdr:./git-projects/my-git-project",
    "all-my-git-projects": "bdr:./git-projects/*"
  }
}
```

For now when defining `path` you can use `*` as last character to iterate through all direct subdirectories. `bower-dependecies-resolver` will compile all `bower.json` files into one "virtual" bower-package and then bower will be able to install all necessary dependecies.

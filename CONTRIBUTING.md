# Contributing to Sideral JS

Many thanks for contributing to its development. The following is a quick set of guidelines designed to maximise your contribution's effectiveness.

## Prerequisites

To be able to contribute on SGR project, you will need :

- NodeJS (v6.0)
- ESLint
- Commitizen

## How the project view works

In the [project view](https://github.com/js-republic/sideral/projects/1), you can see four columns : *Ideation* -> *Todos* -> *Work in progress* -> *Done*

- *Ideation* : Is the step where Epics are debated. The Epic come from the core team or are voted on [Feathub](http://feathub.com/js-republic/sideral).
An Epic will list all stories attached to him.
- *Todos* : In this step, the epics, and the stories a defined and wait for contributor (maybe you :tada:). 
If someone wants work on a story, it can add a comment on it and core team will pass the story in next column.
- *Work in progress* : Contains all stories currently developed. To be done, each story must be implemented in a pull-request, have well designed commit history, covered by unit tests and finally submit and reviewed by the core commiter team.
- *Done* : The final step, this column contains all finished stories

## Pull requests

All pull requests are welcome. You should create a new branch, based on the **master branch**, and submit the PR against the **dev branch**.

Your branch name must be explicit like this : feature/componentWeather. All development branch must starts with feature/yourFeature and must be a reference to an issue.

**Your branch must have unit tests ! All PR without Unit test will not be accepted.**

Before submitting, run `yarn run build` to ensure the build passes.

## Conventions of code

 - Use tabs instead of spaces
 - Dont forget semicolons after each instructions
 - Use single quotes for strings
 - Use only camelCase 

Above all, code should be clean and readable, and commented where necessary.
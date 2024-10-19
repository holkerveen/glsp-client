# workflow-glsp

This package contains the standalone frontend GLSP Workflow example.

## Building

Run `yarn build` to build the example. The build artifacts will be stored in the `app/` directory, alongside the
diagram.html file.

### Changing example file path

The file path of the example file can be changed by passing the EXAMPLE_PATH environment variable to the webpack build.

```bash
EXAMPLE_PATH=/app/examples/workflow-standalone/app/example1.wf yarn build
```

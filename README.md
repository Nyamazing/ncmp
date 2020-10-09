# ncmp

Compare two files by node.

# Installing

```
npm install --save @nyamazing/ncmp
```

# usage

Node:

```
const ncmp = require('@nyamazing/ncmp').ncmp;

ncmp('./file1', './file2')
  .then(x => console.log(x));
```

TypeScript:

```
import { ncmp } from '@nyamazing/ncmp';

ncmp('./file1', './file2')
  .then(x => console.log(x));
```

Command line:

```
$(npm bin)/ncmp ./file1 ./file2
```

# Options

Offset:

Number of bytes to skip.

Node:

```
ncmp('./file1', './file2', 300);
```

Command line:

```
ncmp ./file1 ./file2 300
```

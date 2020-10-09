import fs from 'fs';

const highWaterMark = 1024;

export type cmpResultSame = { same: true };
export type cmpResultDifferent = {
  same: false,
  char: number | undefined,
};

export type cmpResult = cmpResultSame | cmpResultDifferent;

const reader = async function* (stream: fs.ReadStream) {
  for await (const chunk of stream) {
    yield chunk as string;
  }
}

const createDifferentResultResponse = (char?: number) => Promise.reject({
  same: false,
  char: char,
});

const successResult: cmpResultSame = {
  same: true,
};

export const ncmp = async (file1: string, file2: string, offset: number = 0): Promise<cmpResultSame> => {

  const s1 = fs.createReadStream(file1, { highWaterMark });
  const s2 = fs.createReadStream(file2, { highWaterMark });

  const i1 = reader(s1);
  const i2 = reader(s2);

  let remainOffset = offset;
  let sameChar = 0;
  while (true) {
    const d1 = await i1.next();
    const d2 = await i2.next();

    if (d1.done && d2.done) { break; }
    if (d1.done || d2.done) { return createDifferentResultResponse(); }
    if (d1.value.length !== d2.value.length) { return createDifferentResultResponse(); }

    if (d1.value.length <= remainOffset) {
      remainOffset = remainOffset - d1.value.length;
      continue;
    }

    for (let i = remainOffset; i < d1.value.length; i++) {
      sameChar++;
      if (d1.value[i] !== d2.value[i]) {
        return createDifferentResultResponse(sameChar);
      }
    }
    remainOffset = 0;
  }

  return Promise.resolve(successResult);
};

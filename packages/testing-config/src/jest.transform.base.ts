/*
테스트 환경에서는 "image.png"가 출력됨

import image from './image.png';
console.log(image); 
*/

const path = require('path');

module.exports = {
  process(sourceText: string, sourcePath: string, options: any) {
    return {
      code: `module.exports = ${JSON.stringify(path.basename(sourcePath))};`,
    };
  },
};

export const nomalizeIndex = (index: number, length: number) => {
    const half = Math.floor(length / 2);
  
    if (index < half) {
      return -(half - index) * 3.3;
    } else if (index === half) {
      return 0;
    }
    return (index - half) * 3.3;
  };
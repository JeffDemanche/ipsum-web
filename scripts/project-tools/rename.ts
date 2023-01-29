export const renameField = (data: any, arg: string) => {
  let parent = data;

  const splitFieldPath = arg.split(" ");
  const renameTo = splitFieldPath.pop();

  if (splitFieldPath.length > 0) {
    splitFieldPath.forEach((key, i) => {
      if (parent[key]) {
        if (i < splitFieldPath.length - 1) {
          parent = parent[key];
        }
      }
    });
  }

  const value = parent[splitFieldPath[splitFieldPath.length - 1]];
  delete parent[splitFieldPath[splitFieldPath.length - 1]];
  parent[renameTo] = value;
};

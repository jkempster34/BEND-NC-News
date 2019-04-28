exports.timeStampToDate = (arr, dateColumn = "created_at") => {
  if (!Object.keys(arr[0]).length) return [{}];
  const result = arr.map(element => {
    const newElement = { ...element };
    newElement[dateColumn] = new Date(newElement[dateColumn]).toISOString();
    return newElement;
  });
  return result;
};

exports.changeNameOfKey = (
  arr,
  nameOfKey = "created_by",
  newName = "author"
) => {
  if (!Object.keys(arr[0]).length) return [{}];
  const result = arr.map(({ [nameOfKey]: old, ...others }) => {
    return { [newName]: old, ...others };
  });
  return result;
};

exports.createLookupObject = (
  array,
  keyOne = "title",
  keyTwo = "article_id"
) => {
  const result = array.reduce((accumlator, current) => {
    accumlator[current[keyOne]] = current[keyTwo];
    return accumlator;
  }, {});
  return result;
};

exports.swapOutAKey = (
  array,
  lookupObject,
  newKey = "article_id",
  newValue = "belongs_to"
) => {
  if (!Object.keys(array[0]).length) return [{}];
  const result = array.map(({ [newValue]: old, ...others }) => {
    return { [newKey]: lookupObject[old], ...others };
  });
  return result;
};

exports.makePOSTCommentSuitable = (object, article_id) => {
  if (!Object.keys(object).length) return {};
  const { username, ...restOfObject } = object;
  return { author: username, ...restOfObject, article_id: article_id };
};

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
  const result = arr.map(element => {
    const newElement = { ...element };
    newElement[newName] = newElement[nameOfKey];
    delete newElement[nameOfKey];
    return newElement;
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
  const result = array.map(element => {
    const newElement = { ...element };
    newElement[newKey] = lookupObject[newElement[newValue]];
    delete newElement[newValue];
    return newElement;
  });
  return result;
};

exports.makePOSTCommentSuitable = (object, article_id) => {
  if (!Object.keys(object).length) return {};
  const newObject = { ...object };
  newObject.author = newObject.username;
  delete newObject.username;
  newObject.article_id = article_id;
  return newObject;
};

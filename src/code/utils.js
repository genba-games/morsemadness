export const centerGameObjects = (objects) => {
  objects.forEach(function (object) {
    object.anchor.setTo(0.5)
  })
}

export const nearestMultiple = (number, multiple) =>{
  return ((number + multiple / 2) / multiple) * multiple;
}

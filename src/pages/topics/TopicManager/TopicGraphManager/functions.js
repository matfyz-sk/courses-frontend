export const createCustomNode = (element, user) => {
  let understood = user?.understands?.some(item => item._id === element._id);
  return {
    id: element._id,
    data: {
      label: element.name,
      description: element.description,
      primaryColor: element.isVisualizedBy.hasPrimaryColor,
      secondaryColor: element.isVisualizedBy?.hasSecondaryColor,
      shape: element['isVisualizedBy'].hasShape,
      understood: understood
    },
    position: { x: 0, y: 0 },
    type: 'custom',
  }
}


export const createCustomNode = (element, user) => {
  let understands = user?.understands?.some(item => item._id === element._id);
  return {
    id: element._id,
    data: {
      label: element.name,
      description: element.description,
      color: understands ? element['isVisualizedBy']['hasSecondaryColor'] : element['isVisualizedBy']['hasPrimaryColor'],
      shape: element['isVisualizedBy'].hasShape
    },
    position: { x: 0, y: 0 },
    type: 'custom',
  }
}


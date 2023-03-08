import { AttributeType } from "../models/attribute-type.model";

module.exports = () => {
  return AttributeType.bulkCreate([
    {
      attribute_type_key: 'OTHER',
      attribute_type_label: 'Autre'
    },
    {
      attribute_type_key: 'CAM',
      attribute_type_label: 'Caméra'
    },
    {
      attribute_type_key: 'GRAPH',
      attribute_type_label: 'Carte Graphique'
    },
    {
      attribute_type_key: 'PROCESSOR',
      attribute_type_label: 'Processeur'
    },
    {
      attribute_type_key: 'RAM',
      attribute_type_label: 'RAM / Mémoire vive'
    },
    {
      attribute_type_key: 'ROM',
      attribute_type_label: 'Mémoire / Stockage'
    }
  ])
}
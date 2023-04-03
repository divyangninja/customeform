import gql from "graphql-tag";

export const CREATE_TEMPLATE = gql`
  mutation createTemplate(
    $templatName: String!
    $templateField: [FieldGroupInput]
  ) {
    createTemplate(templatName: $templatName, templateField: $templateField) {
      msg
    }
  }
`;

export const GET_TEMPLATE_LIST = gql`
  query getAllTemplateData {
    getAllTemplateData {
      TemplateId
      TemplateName
      TemplateTitle
      TemplateField {
        id
        label
        type
        maxValue
        pickList
        decimalPoint
        title
      }
    }
  }
`;

export const GET_TEMPLATE_BYID = gql`
  query getTemplateById($id: ID) {
    getTemplateById(id: $id) {
      TemplateId
      TemplateName
      TemplateTitle
      TemplateField {
        id
        label
        type
        maxValue
        pickList
        decimalPoint
        title
      }
    }
  }
`;

export const GET_ALL_RECORD = gql`
  query getRecordByTemplateName($templateName: String) {
    getRecordByTemplateName(templateName: $templateName) {
      record
    }
  }
`;

export const INSERT_RECORD = gql`
  mutation insertDataFromField(
    $TemplateName: String
    $TemplateRecord: GenericScalar
  ) {
    insertDataFromField(
      TemplateName: $TemplateName
      TemplateRecord: $TemplateRecord
    ) {
      msg
    }
  }
`;

export const UPDATE_RECORD = gql`
  mutation updateDataFromField(
    $TemplateName: String
    $TemplateRecord: GenericScalar
  ) {
    updateDataFromField(
      TemplateName: $TemplateName
      TemplateRecord: $TemplateRecord
    ) {
      msg
    }
  }
`;

export const DELETE_RECORD = gql`
  mutation deleteDataFromField($RecordId: ID, $TemplateName: String) {
    deleteDataFromField(RecordId: $RecordId, TemplateName: $TemplateName) {
      msg
    }
  }
`;

import React, { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { useMutation } from "@apollo/react-hooks";
import { InputLabel } from "@mui/material";
import CardTemp from "../../../component/CardTemp";
import { CREATE_TEMPLATE } from "../../../query/query";
import AddBoxIcon from "@mui/icons-material/AddBox";
import toastr from "toastr";

import style from "../template.module.css";

function SubTemplate({ handleModel, data }) {
  const [templateName, setTemplateName] = useState("");
  const [fieldDataList, setFieldDataList] = useState([
    {
      label: "",
      type: "TEXT",
      maxValue: "",
      decimalPoint: "",
      pickList: [],
    },
  ]);

  const [addTemplate] = useMutation(CREATE_TEMPLATE, {
    onCompleted(proxy, result) {
      toastr.success("Template Added Successfully");
      handleModel(false);
    },
    onError(err) {
      toastr.error(err.message);
    },
  });

  const [editTemplate] = useMutation(CREATE_TEMPLATE, {
    onCompleted(proxy, result) {
      toastr.success("Template Update Successfully");
      handleModel(false);
    },
    onError(err) {
      toastr.error(err.message);
    },
  });

  const submitHandle = () => {
    // toastr.success("Template Added Successfully");
    if (data?.id) {
      editTemplate({
        variables: {
          templatName: templateName,
          templateField: fieldDataList,
        },
      });
    } else {
      // let fieldDataa = [...fieldDataList];
      // fieldDataa[0].maxValue = null;

      addTemplate({
        variables: {
          templatName: templateName,
          templateField: fieldDataList,
        },
      });
    }
  };

  const handleNameChange = (event) => {
    setTemplateName(event.target.value);
  };

  const handleChange = (event, index) => {
    const tempArray = [...fieldDataList];

    if (index > -1) {
      const { name, value } = event.target;
      tempArray[index][name] = value;
      setFieldDataList(tempArray);
    }
    // console.log(tempArray);
  };

  const removeField = (index) => {
    const tempArray = [...fieldDataList];
    if (index > -1) {
      tempArray.splice(index, 1);
    }
    setFieldDataList(tempArray);
  };

  const addField = () => {
    const tempArray = [...fieldDataList];
    tempArray.push({
      label: "",
      type: "TEXT",
      maxValue: "",
      decimalPoint: "",
      pickList: [],
    });
    setFieldDataList(tempArray);
  };

  return (
    <div>
      <Box className={style.frmField}>
        <InputLabel
          sx={{ display: "flex", alignItems: "center", paddingRight: "5px" }}
        >
          Template Name :
        </InputLabel>
        <TextField
        autoComplete="off"
          id="outlined-basic"
          name="name"
          value={templateName}
          onChange={(event) => handleNameChange(event)}
        />
      </Box>
      <Box>
        <InputLabel >Add Fields :</InputLabel>
        <Box className={style.fieldPanel}>
          <Box>
            {fieldDataList.map((fieldData, index) => {
              return (
                <React.Fragment key={`id_${index}`}>
                  <CardTemp
                    fieldData={fieldData}
                    removeField={removeField}
                    handleChange={handleChange}
                    index={index}
                    isDisplayClose={fieldDataList.length > 1}
                  />
                </React.Fragment>
              )
            })}
          </Box>
        </Box>
      </Box>
      <Box>
        <Box display="flex" alignItems="center" justifyContent="space-around">
          <AddBoxIcon className={style.iconAdd} onClick={addField} />
        </Box>
        <div className={style.btnGroup}>
          <Button
            variant="contained"
            onClick={() => handleModel(false)}
            style={{ marginRight: "5px" }}
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            onClick={submitHandle}
            style={{ marginLeft: "5px" }}
          >
            Submit
          </Button>
        </div>
      </Box>
    </div>
  );
}

export default SubTemplate;

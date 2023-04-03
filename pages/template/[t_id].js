import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useMutation } from "@apollo/react-hooks";
import { useQuery } from "@apollo/client";
import Link from "next/link";
import {
  DELETE_RECORD,
  GET_ALL_RECORD,
  GET_TEMPLATE_BYID,
  INSERT_RECORD,
  UPDATE_RECORD,
} from "../../query/query";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  TextareaAutosize,
  OutlinedInput,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import toastr from "toastr";
import style from "../template/template.module.css";

const CustomTemplate = () => {
  const router = useRouter();
  const t_id = router.query.t_id;
  const [inputFields, setInputFields] = useState({});
  const [fieldsList, setFieldsList] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
  const [dataArr, setDataArr] = useState([]);
  const [columns, setColumns] = useState([]);

  const { data: formData, loading: loadingForm } = useQuery(GET_TEMPLATE_BYID, {
    variables: {
      id: router.query?.id,
    },
  });

  const {
    data: recordData,
    loading: loadingRecord,
    refetch: dataRefetch,
  } = useQuery(GET_ALL_RECORD, {
    variables: {
      templateName: t_id,
    },
  });

  useEffect(() => {
    if (!loadingRecord && recordData?.getRecordByTemplateName?.record) {
      setDataArr(recordData?.getRecordByTemplateName?.record);
      console.log("recordData", recordData);
    }
  }, [loadingRecord, recordData]);

  const handleOpration = (type, msg) => {
    if (type === "success") {
      toastr.success(msg);
      dataRefetch();
    } else {
      toastr.error(msg);
    }
  };

  const [insertRecord] = useMutation(INSERT_RECORD, {
    onCompleted(proxy, result) {
      handleOpration("success", "Record Inserted Successfully");
    },
    onError(err) {
      handleOpration("error", err.message);
    },
  });

  const [updateRecord] = useMutation(UPDATE_RECORD, {
    onCompleted(proxy, result) {
      handleOpration("success", "Record Updated Successfully");
    },
    onError(err) {
      handleOpration("error", err.message);
    },
  });

  const [deleteRecord] = useMutation(DELETE_RECORD, {
    onCompleted(proxy, result) {
      handleOpration("success", "Record Deleted Successfully");
    },
    onError(err) {
      handleOpration("error", err.message);
    },
  });

  useEffect(() => {
    if (!loadingForm && formData?.getTemplateById?.TemplateField) {
      const customObj = {
        // id: "",
      };
      let fieldsArray = [];
      let columnArray = [
        {
          field: "id",
          headerName: "Id",
          width: 80,
        },
      ];

      formData?.getTemplateById?.TemplateField.forEach((f) => {
        const _f = { ...f };
        console.log("_f", _f);

        const tempColumnObj = {
          field: f.label,
          headerName: f.title,
          sortable: !f.type.includes("M_Json"),
          width: 230,
        };
        // if (f.type.includes("INT")) {
        //   tempColumnObj.renderCell = (value) => {
        //     return <>{value.row[f.label].toString()}</>;
        //   };
        // } else {
        // }
        columnArray.push(tempColumnObj);
        customObj[f.label] = "";
        tempColumnObj[f.label] = "";

        if (f.type.includes("Json")) {
          customObj[f.label] = [];
        }
        _f.pickList = JSON.parse(f.pickList ?? []);
        fieldsArray.push(_f);
      });

      columnArray.push({
        field: "actions",
        headerName: "Actions",
        width: 400,
        renderCell: (params) => {
          debugger;
          return (
            <>
              <AiFillEdit
                className={style.editBtn}
                onClick={() => {
                  setToggle(true);
                  setInputFields(params.row);
                }}
              />
              <AiFillDelete
                className={style.deleteBtn}
                onClick={() => {
                  deleteRecord({
                    variables: {
                      RecordId: params.id,
                      TemplateName: t_id,
                    },
                  });
                }}
              />
            </>
          );
        },
      });
      setColumns(columnArray);
      console.log("columnArray", columnArray);
      setFieldsList(fieldsArray);
      setInputFields(customObj);
    }
  }, [formData, loadingForm]);

  const handleChange = (event, input) => {
    const { name, value } = event.target;
    debugger;
    if (input.type.includes("DECIMAL")) {
      const regX = new RegExp(`^\d+(\.\d{0,${input.decimalPoint}})?$`);
      if (regX.test(value) || /^[\d+(\.\d{0,3})]?$/.test(value)) {
        setInputFields({
          ...inputFields,
          [name]: value,
        });
      }
    } else {
      setInputFields({
        ...inputFields,
        [input.label]:
          input.type === "INT"
            ? Number(value)
            : input.type === "M_Json"
            ? typeof value === "string"
              ? value.split(",")
              : value
            : input.type === "Json"
            ? [value]
            : value,
      });
    }
  };

  const handleSubmit = () => {
    if (toggle) {
      const data = {
        TemplateName: formData?.getTemplateById.TemplateName,
        TemplateRecord: inputFields,
      };
      updateRecord({ variables: data });
      setToggle(false);
    } else {
      const data = {
        // TemplateId: formData?.getTemplateById.TemplateId,
        TemplateName: formData?.getTemplateById.TemplateName,
        TemplateRecord: inputFields,
      };
      console.log("formData", formData);
      insertRecord({ variables: data });
      setToggle(false);
    }
  };

  useEffect(() => {
    console.log("inputFields", inputFields);
    console.log("dataArr", dataArr);
  }, [dataArr]);

  return (
    <>
      <div className="App">
        <Link href={{ pathname: `\\template` }}>
          <div className={style.back}>
            <ArrowBackIcon />
            Back
          </div>
        </Link>
        {!loadingForm && fieldsList.length > 0 ? (
          <>
            <Box className={style.frmTemplate}>
              <form className={style.formData}>
                {fieldsList.map((input, index) => {
                  let val = inputFields?.[input.label];
                  if (input.type === "DATE") {
                    const date = new Date(val);
                    val = `${date.getFullYear()}-${(
                      "0" +
                      (date.getMonth() + 1)
                    ).slice(-2)}-${("0" + date.getDate()).slice(-2)}`;
                  }
                  return (
                    <div key={`field_${index}`}>
                      {input.type === "Json" ? (
                        <FormControl style={{ width: 220 }}>
                          <InputLabel id="demo-simple-select-label">
                            {input.title}
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={val?.length > 0 ? val[0] : ""}
                            label={input.title}
                            name={input.label}
                            onChange={(event) => handleChange(event, input)}
                            input={<OutlinedInput label="Name" />}
                          >
                            {input.pickList.map((item,index) => {
                              return <MenuItem key={`mm_${index}`} value={item}>{item}</MenuItem>;
                            })}
                          </Select>
                        </FormControl>
                      ) : ["TEXT", "INT", "DATE"].includes(input.type) ? (
                        <TextField
                          required
                          type={
                            input.type === "INT"
                              ? "number"
                              : input.type.toLowerCase()
                          }
                          id="outlined-required"
                          label={input.title}
                          name={input.label}
                          value={val}
                          InputLabelProps={{ shrink: true, required: true }}
                          onChange={(event) => handleChange(event, input)}
                        />
                      ) : input.type === "M_Json" ? (
                        <FormControl sx={{ width: 220 }}>
                          <InputLabel id="demo-multiple-checkbox-label">
                            {input.title}
                          </InputLabel>
                          <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            name={input.title}
                            label={input.label}
                            value={val ?? []}
                            onChange={(event) => handleChange(event, input)}
                            // input={<OutlinedInput label="Name" />}
                          >
                            {input.pickList?.map((name) => {
                              return (
                                <MenuItem key={name} value={name}>
                                  {name}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      ) : input.type.includes("CHAR(") ? (
                        <>
                          <InputLabel id="demo-textarea">
                            {input.title}
                          </InputLabel>
                          <TextareaAutosize
                            id="demo-textarea"
                            maxRows={4}
                            placeholder="Add your Text Here"
                            name={input.label}
                            value={val}
                            onChange={(event) => handleChange(event, input)}
                            style={{ width: 220, height: 50 }}
                          />
                        </>
                      ) : (
                        <TextField
                          required
                          type="text"
                          id="_outlined-required"
                          label={input.title}
                          name={input.label}
                          value={val}
                          InputLabelProps={{ shrink: true, required: true }}
                          onChange={(event) => handleChange(event, input)}
                        />
                      )}
                      <br></br>
                      <br></br>
                    </div>
                  );
                })}
                <Button variant="outlined" onClick={handleSubmit}>
                  {toggle ? "Update" : "Submit"}
                </Button>
              </form>
            </Box>
            <Box className={style.table}>
              <DataGrid
                autoHeight
                rows={dataArr}
                columns={columns}
                pagination
                pageSize={5}
                rowsPerPageOptions={[5]}
                onRowSelectionModelChange={(newRowSelectionModel) => {
                  setRowSelectionModel(newRowSelectionModel);
                }}
                rowSelectionModel={rowSelectionModel}
              />
            </Box>
          </>
        ) : (
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            No Record Found
          </div>
        )}
      </div>
    </>
  );
};
export default CustomTemplate;

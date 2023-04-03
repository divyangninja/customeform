import {
  Box,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useRef, useState } from "react";
import style from "../pages/template/subTemplate/subTemplate.module.css";
import { Cancel } from "@mui/icons-material";

function CardTemp({
  fieldData,
  removeField,
  index,
  handleChange,
  isDisplayClose,
}) {
  const [tags, SetTags] = useState([]);
  const tagRef = useRef();
  const fields = {
    String: "TEXT",
    Date: "DATE",
    Number: "BIGINT",
    PickList: "Json",
    "Multy PickList": "M_Json",
    TextArea: "CHAR()",
    DecimalPoint: "DECIMAL(15,)",
  };

  const handleDelete = (value) => {
    const newtags = tags.filter((val) => val !== value);
    SetTags(newtags);
    handleSubmit({ target: { name: "pickList", value: newtags } }, index);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const tempList = [...tags];
    tempList.push(tagRef.current.value);
    SetTags(tempList);
    tagRef.current.value = "";
    handleSubmit({ target: { name: "pickList", value: tempList } }, index);
  };

  const Tags = ({ data, handleDelete }) => {
    return (
      <Box
        sx={{
          background: "rgb(94 94 223);",
          height: "100%",
          display: "flex",
          padding: "0.4rem",
          margin: "0 0.5rem 0 0",
          justifyContent: "center",
          alignContent: "center",
          color: "#ffffff",
        }}
      >
        <Stack direction="row" gap={1}>
          <Typography>{data}</Typography>
          <Cancel
            sx={{ cursor: "pointer" }}
            onClick={() => {
              handleDelete(data);
            }}
          />
        </Stack>
      </Box>
    );
  };
  const handleSubmit = (event, index) => {
    handleChange(event, index);
  };
  return (
    <Card className={style.fieldCard}>
      {isDisplayClose && (
        <Cancel
          className={style.iconClose}
          onClick={() => removeField(index)}
        />
      )}
      <br></br>
      <CardContent>
        <Box className={style.addfields}>
          <Stack direction="row" spacing={1}>
            <InputLabel>Label :</InputLabel>
            <TextField
              sx={{ width: "40%" }}
              id="outlined-basic"
              name="label"
              value={fieldData?.label}
              onChange={(event) => handleChange(event, index)}
            />
            <InputLabel>Type :</InputLabel>

            <FormControl>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={fieldData?.type}
                name="type"
                onChange={(event) => handleSubmit(event, index)}
              >
                {Object.entries(fields).map((e,index) => {
                  return <MenuItem key={`mi_${index}`} value={e[1]}>{e[0]}</MenuItem>;
                })}
              </Select>
            </FormControl>
          </Stack>
        </Box>

        {fieldData?.type.includes("Json") && (
          <Box sx={{ flexGrow: 1 }}>
            <form onSubmit={handleOnSubmit}>
              <TextField
                id="outlined-basic"
                inputRef={tagRef}
                fullWidth
                variant="standard"
                size="small"
                sx={{ margin: "1rem 0" }}
                margin="none"
                placeholder={tags.length < 5 ? "Enter tags" : ""}
                InputProps={{
                  startAdornment: (
                    <Box sx={{ margin: "0 0.2rem 0 0", display: "flex" }}>
                      {tags.map((data, index) => {
                        return (
                          <Tags
                            data={data}
                            handleDelete={handleDelete}
                            key={index}
                          />
                        );
                      })}
                    </Box>
                  ),
                }}
              />
            </form>
          </Box>
        )}

        {fieldData?.type === "DECIMAL(15,)" && (
          <>
            <InputLabel>Decimal Point </InputLabel>
            <TextField
              fullWidth
              id="outlined-disabled"
              name="decimalPoint"
              value={fieldData.decimalPoint}
              type="number"
              onChange={(event) => handleChange(event, index)}
            />
          </>
        )}

        {fieldData.type === "CHAR()" && (
          <>
            <InputLabel>Max Value:</InputLabel>
            <TextField
              fullWidth
              id="outlined-disabled"
              name="maxValue"
              type="number"
              value={fieldData.maxValue}
              onChange={(event) => handleChange(event, index)}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default CardTemp;

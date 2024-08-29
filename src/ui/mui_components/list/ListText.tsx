import { ListItem, ListItemText } from "@mui/material";

type ListTextType = {
   title: string;
   main: string | number;
};

const ListText = ({ title, main }: ListTextType) => (
   <ListItem>
      <ListItemText primary={title} />
      <span style={{ color: "grey" }}>{main}</span>
   </ListItem>
);

export default ListText;

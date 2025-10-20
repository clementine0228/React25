import { Box, Container, List, ListItem, ListItemText} from "@mui/material";
import { blue } from '@mui/material/colors';

export default function OrderList() {
  const orders = [
    { desc: "iPad", amount: 200 },
    { desc: "iPhone 8", amount: 500 },
    { desc: "iPhone X", amount: 1000 }
  ];
  const itemStyle = {
    bgcolor: blue[50],
    borderRadius: 2,
    boxShadow: 3,
    p: 2,
  };
  const listItemStyle = {
    bgcolor: blue[100],
    borderRadius: 1,
    mb: 1,
    boxShadow: 1,
  };
  return (
    <Container >
    <Box sx={itemStyle} >
      <List subheader="Order list" aria-label="order list" >
        {orders.map((order) =>
          <ListItem divider key={order.desc} sx={listItemStyle}>
            <ListItemText
              primary={<span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{order.desc}</span>}
              secondary={<span style={{ color: blue[700], fontWeight: 500 }}> {order.amount.toString()}</span>}
            />
          </ListItem>
        )}
      </List>
    </Box>
    </Container>
  );
}
import {
  Br,
  Cut,
  Line,
  Printer,
  Text,
  Row,
  render,
} from "react-thermal-printer";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

const { name } = useParams();
const [company, setcompany] = useState(
  JSON.parse(localStorage.getItem("selected_branch"))
);
const response = JSON.parse(localStorage.getItem("data"));
const [data, setdata] = useState(response);
const [customer, setcustomer] = useState(response.customer_info);
const [details, setdetails] = useState(response.details);

const receipt = (
  <Printer type="epson" width={42}>
    <Image align="center" src={company.logo} />
    <Text align="center" bold={true}>
      {company.name}
    </Text>
    <Text align="center">{company.contact}</Text>
    <Text align="center">{company.address}</Text>
    <Br />
    <Line />
    <Text align="center" bold={true} size={{ width: 2, height: 2 }}>
      Sale Invoice
    </Text>
    <Line />
    <Row left={`Party: ${customer.name}`} right={`Bill No: ${data.invoice}`} />
    <Row right={`Date: ${data.date}`} />
    <Line />
    <Row
      left={<Row left={"Name"} right={"Qty"} />}
      right={<Row left={"Price"} right={"Total"} />}
    />
    <Line />
    {details.map((item) => (
      <Row
        left={<Row left={item.product_name} right={item.quatity} />}
        right={<Row left={item.price} right={item.total} />}
      />
    ))}
    <Line />
    <Br />
    <Row left="Subtotal" right={data.sub_total} />
    <Row left="Tax" right={data.tax_amount} />
    <Row left="Total" right={data.total} />
    <Text align="center">Thanks For Visiting</Text>
    <Text align="center">{data.remarks}</Text>

    <Cut />
  </Printer>
);
export const datatoprint = await render(receipt);

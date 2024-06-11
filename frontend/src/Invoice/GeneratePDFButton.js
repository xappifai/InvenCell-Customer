import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import { saveAs } from "file-saver";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
  },
  section: {
    marginBottom: 10,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  table: {
    display: "table",
    width: "auto",
    marginTop: 20,
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "25%",
    textAlign: "left",
    borderBottom: "1 solid black",
    fontWeight: "bold",
    padding: 5,
  },
  tableCol: {
    width: "25%",
    textAlign: "left",
    borderBottom: "1 solid gray",
    padding: 5,
  },
  footer: {
    textAlign: "center",
    marginTop: 20,
  },
});

const InvoiceDocument = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>INVOICE</Text>
        <View>
          <Text>Date: {data.date}</Text>
          <Text>Invoice No: {data.invoiceNo}</Text>
        </View>
      </View>
      <View style={styles.section}>
        <Text>BILL TO:</Text>
        <Text>{data.billTo.name}</Text>
        <Text>{data.billTo.phoneNumber}</Text>
        <Text>{data.billTo.address}</Text>
      </View>
      <View style={styles.section}>
        <Text>FROM:</Text>
        <Text>{data.from.name}</Text>
        <Text>{data.from.phoneNumber}</Text>
        <Text>{data.from.address}</Text>
      </View>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableColHeader}>DESCRIPTION</Text>
          <Text style={styles.tableColHeader}>IMEI</Text>
          <Text style={styles.tableColHeader}>PRICE</Text>
          <Text style={styles.tableColHeader}>TOTAL</Text>
        </View>
        {data.items.map((item, index) => (
          <View style={styles.tableRow} key={index}>
            <Text style={styles.tableCol}>{item.description}</Text>
            <Text style={styles.tableCol}>{item.imei}</Text>
            <Text style={styles.tableCol}>{item.price}</Text>
            <Text style={styles.tableCol}>{item.total}</Text>
          </View>
        ))}
      </View>
      {data.exchangeItems && data.exchangeItems.length > 0 && (
        <View style={styles.section}>
          <Text>EXCHANGE ITEMS:</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>DESCRIPTION</Text>
              <Text style={styles.tableColHeader}>IMEI</Text>
              <Text style={styles.tableColHeader}>PRICE</Text>
              <Text style={styles.tableColHeader}>TOTAL</Text>
            </View>
            {data.exchangeItems.map((item, index) => (
              <View style={styles.tableRow} key={index}>
                <Text style={styles.tableCol}>{item.description}</Text>
                <Text style={styles.tableCol}>{item.imei}</Text>
                <Text style={styles.tableCol}>{item.price}</Text>
                <Text style={styles.tableCol}>{item.total}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
      <Text>Total amount: Rs{data.totalAmount}</Text>
      <View style={styles.footer}>
        <Text>Thank you for your business!</Text>
      </View>
    </Page>
  </Document>
);

const generatePDF = async (invoiceData, fileName) => {
  const blob = await pdf(<InvoiceDocument data={invoiceData} />).toBlob();
  saveAs(blob, `${fileName}.pdf`);
};
export default generatePDF;

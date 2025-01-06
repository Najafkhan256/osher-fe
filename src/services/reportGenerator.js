import jsPDF from 'jspdf';
import 'jspdf-autotable';
// import { format } from "date-fns";
import moment from 'moment';


const generatePDF = (orders, user, start, end) => {
  const doc = new jsPDF();
  const tableColumn = ['Index', 'Coupon', 'Buyer', 'Date', 'Status', 'Amount'];
  const tableRows = [];

  let index = 1;

  orders.forEach((order) => {
    const orderData = [
      index++,
      order.coupon,
      order.name,
      moment(order.publishDate).format('ll'),
      order.orderStatus,
      '$' + order.offerPrice,
    ];
    tableRows.push(orderData);
  });

  doc.setFontSize(27);
  doc.setFont('helvetica', 'bold');
  doc.text('Osher', 14, 15);

  doc.setTextColor(100);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'normal');
  doc.text(user, 14, 23);
  // doc.text('Total: PKR ' + total, 195, 23, null, null, 'right');
  doc.setFontSize(9);
  doc.text('Date from: ' + start + '    >    To: ' + end, 14, 30);

  doc.autoTable(tableColumn, tableRows, { startY: 34 });

  doc.save('Osher Report.pdf');
};

export default generatePDF;

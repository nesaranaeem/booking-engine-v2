import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { format } from 'date-fns';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  logo: {
    width: 150,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    backgroundColor: '#f3f4f6',
    padding: 5,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: '30%',
    fontWeight: 'bold',
  },
  value: {
    width: '70%',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    borderTop: '1pt solid #cbd5e1',
    paddingTop: 10,
    fontSize: 10,
    color: '#64748b',
  },
});

const BookingInvoice = ({ booking }) => {
  const formatDate = (dateString) => {
    return format(new Date(dateString), "MMMM d, yyyy");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(amount);
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>BOOKING INVOICE</Text>
            <Text>Invoice No: {booking.invoiceNo}</Text>
            <Text>Date: {formatDate(booking.createdAt)}</Text>
          </View>
        </View>

        {/* Booking Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Activity:</Text>
            <Text style={styles.value}>{booking.activityName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Package:</Text>
            <Text style={styles.value}>{booking.packageName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Travel Date:</Text>
            <Text style={styles.value}>{formatDate(booking.travelDate)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Number of Adults:</Text>
            <Text style={styles.value}>{booking.adults}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Number of Children:</Text>
            <Text style={styles.value}>{booking.children}</Text>
          </View>
        </View>

        {/* Customer Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{booking.guestName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{booking.email}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{booking.phone}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Nationality:</Text>
            <Text style={styles.value}>{booking.nationality}</Text>
          </View>
        </View>

        {/* Payment Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Total Amount:</Text>
            <Text style={styles.value}>{formatCurrency(booking.totalPrice)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Payment Status:</Text>
            <Text style={styles.value}>{booking.paymentStatus}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Transaction Ref:</Text>
            <Text style={styles.value}>{booking.paymentToken || "Not available"}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Thank you for your booking!</Text>
          <Text>For any inquiries, please contact our support team.</Text>
        </View>
      </Page>
    </Document>
  );
};

export default BookingInvoice;

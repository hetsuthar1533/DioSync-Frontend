import React, { useEffect, useState } from 'react'
import { Page, Text, View, Image, Document, StyleSheet } from '@react-pdf/renderer'
import noImage from '../../assets/images/noImg.png'
import { fetchImageAsBase64 } from '../../utils/commonHelper'

const styles = StyleSheet.create({
  page: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  orderBy: {
    fontSize: 14,
    textAlign: 'left',
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitleAddress: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'center',
  },
  table: {
    display: 'table',
    width: 'auto',
    margin: '10px 0',
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableCol: {
    width: '20%',
    border: '1px solid #000',
    padding: 5,
  },
  tableCell: {
    textAlign: 'center',
  },
  image: {
    width: 50,
    height: 50,
  },
})

const OrderReceiptPDF = ({ items, currentCurrency }) => {
  const [images, setImages] = useState({})
  const currentDate = new Date().toLocaleDateString()

  useEffect(() => {
    const loadImages = async () => {
      const imagePromises = items.map(async (item) => {
        if (item?.item?.item_image) {
          const base64Image = await fetchImageAsBase64(item.item.item_image)
          return { id: item.id, image: base64Image }
        }
        return { id: item.id, image: noImage }
      })
      const imagesData = await Promise.all(imagePromises)
      const imagesMap = imagesData.reduce((acc, { id, image }) => {
        acc[id] = image
        return acc
      }, {})
      setImages(imagesMap)
    }

    loadImages()
  }, [items])

  return (
    <Document>
      <Page style={styles?.page}>
        <View>
          <Text style={styles.title}>Order Receipt</Text>
        </View>
        <View>
          <Text style={styles.subtitle}>{items?.[0]?.supplier?.supplier_name}</Text>
          {items?.[0]?.supplier?.address && (
            <Text style={styles.subtitleAddress}>address:{items?.[0]?.supplier?.address}</Text>
          )}
        </View>
        <View style={styles.header}>
          <View style={{ textAlign: 'center' }}>
            <Text style={styles.subtitle}>Download Date: {currentDate}</Text>
          </View>
          <View style={{ textAlign: 'center' }}>
            <Text style={styles.orderBy}>Order By: {items?.[0]?.created_by?.full_name}</Text>
          </View>
        </View>
        <View style={styles.header}>
          <View style={{ textAlign: 'center' }}>
            <Text style={styles.subtitle}>Order date: {items?.[0]?.created_date}</Text>
            <Text style={styles.subtitle}>Delivery date: {items?.[0]?.bar_venue?.name}</Text>
          </View>
          <View style={{ textAlign: 'center' }}>
            <Text style={styles.subtitle}>Delivery to: {items?.[0]?.bar_venue?.name}</Text>
            <Text style={styles.subtitle}>{items?.[0]?.bar_venue?.address}</Text>
          </View>
        </View>

        <View style={styles?.table}>
          <View style={styles?.tableRow}>
            <View style={styles?.tableCol}>
              <Text>Order id</Text>
            </View>
            <View style={styles?.tableCol}>
              <Text>Items name</Text>
            </View>
            <View style={styles?.tableCol}>
              <Text>Unit price</Text>
            </View>
            <View style={styles?.tableCol}>
              <Text>Quantity</Text>
            </View>
            <View style={styles?.tableCol}>
              <Text>Total price</Text>
            </View>
          </View>
          {items?.map((item, index) => (
            <View style={styles?.tableRow} key={index}>
              <View style={styles?.tableCol}>
                <Text>{item?.id}</Text>
              </View>
              <View style={styles?.tableCol}>
                <Image src={item?.item_image || noImage} style={styles?.image} />
                <Text>{item?.item?.item_name}</Text>
              </View>
              <View style={styles?.tableCol}>
                <Text>
                  {currentCurrency} {item?.item?.cost_price}
                </Text>
              </View>
              <View style={styles?.tableCol}>
                <Text>{item?.total_all_qty}</Text>
              </View>
              <View style={styles?.tableCol}>
                <Text>
                  {currentCurrency} {item?.total_amount}
                </Text>
              </View>
            </View>
          ))}
          <View style={styles?.tableRow}>
            <View style={styles?.tableCol} />
            <View style={styles?.tableCol}>
              <Text style={{ fontWeight: 'bold' }}>Total</Text>
            </View>
            <View style={styles?.tableCol} />
            <View style={styles?.tableCol}>
              <Text style={{ fontWeight: 'bold' }}>{items?.[0]?.total_all_qty}</Text>
            </View>
            <View style={styles?.tableCol}>
              <Text style={{ fontWeight: 'bold' }}>
                {currentCurrency} {items?.[0]?.total_all_amount?.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default OrderReceiptPDF

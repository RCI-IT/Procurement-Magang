import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import { capitalizeIndonesia } from "@/utils/capitalizeIndonesia";
import { terbilang } from "@/utils/terbilang";

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 9 },
  headerRow: { flexDirection: "row", justifyContent: "space-between" },
  title: { fontSize: 14, fontWeight: "bold" },
  titlePO: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    alignSelf: "flex-end",
  },
  container: {
    padding: 8,
    width: "200px",
    backgroundColor: "#f9f9f9",
    borderRadius: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  label: {
    fontWeight: "bold",
    fontSize: 10,
    width: "40%",
  },
  value: {
    fontSize: 10,
    width: "60%",
    textAlign: "left",
  },
  logo: {
    width: 80,
    height: "auto",
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ccc",
    fontSize: 9,
  },
  tableRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  headerCell: {
    fontWeight: "bold",
    backgroundColor: "#2979ff",
    color: "#fff",
    borderRightWidth: 1,
    borderRightColor: "#fff",
    padding: 4,
    textAlign: "center",
  },
  noCell: {
    width: 30,
    textAlign: "center",
  },
  codeCell: {
    width: 60,
    padding: 4,
  },
  namaCell: {
    flex: 1,
    padding: 4,
  },
  qtyCell: {
    width: 30,
    textAlign: "center",
    padding: 4,
  },
  satuanCell: {
    width: 40,
    textAlign: "center",
    padding: 4,
  },
  hargaCell: {
    width: 80,
    textAlign: "right",
    padding: 4,
  },
  totalCell: {
    width: 80,
    textAlign: "right",
    padding: 4,
  },
  cell: {
    borderRightWidth: 1,
    borderRightColor: "#ccc",
    padding: 4,
    fontSize: 9,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    flexDirection: "row",
    fontWeight: "bold",
    backgroundColor: "#f3f4f6",
  },
  imageCell: {
    width: 70,
    height: 70,
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "auto",
    objectFit: "contain",
  },

  signatureContainer: {
    marginTop: 30,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  companyHeaderText: {
    fontWeight: "bold",
    borderColor: "#ccc",
    padding: 4,
  },
  signatureHeaderCell: {
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: "#ccc",
    flex: 1,
    padding: 4,
    textAlign: "center",
  },
  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  signatureBox: {
    flex: 1,
    textAlign: "center",
    borderColor: "#ccc",
  },
  boxQR: {
    height: 60,
  },
  qrCode: {
    width: 60,
    height: 60,
    alignSelf: "center",
  },
  roleLabel: {
    fontWeight: "bold",
    fontSize: 9,
    marginTop: 4,
  },
  userName: {
    fontSize: 9,
    marginTop: 2,
  },
});

export const ConfirmOrderPDF = ({ data, totalHarga, dataSign }) => {
  if (!data) return null;

  const getSignatureByRole = (role) =>
    Array.isArray(dataSign) ? dataSign.find((sig) => sig.role === role) : null;
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View>
            <Image src={`/assets/logo1.png`} alt={`Logo`} style={styles.logo} />
            <Text style={styles.title}>PT. REKA CIPTA INOVASI</Text>
            <Text>Jl. Aluminium Perumahan Gatot Subroto Town House No.5</Text>
            <Text>Kel. Sei Sikambing C II, Kec. Medan Helvetia, Medan</Text>
            <Text>Medan, Sumatera Utara, 20213</Text>
          </View>
          <View>
            <Text style={styles.titlePO}>CONFIRMATION ORDER</Text>
            <View style={styles.container}>
              <View style={styles.row}>
                <Text style={styles.label}>Tanggal</Text>
                <Text style={styles.value}>
                  :{" "}
                  {data?.tanggalCO
                    ? new Date(data.tanggalCO).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "N/A"}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Nomor CO</Text>
                <Text style={styles.value}>: {data?.nomorCO || "N/A"}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Nomor PL</Text>
                <Text style={styles.value}>
                  : {data?.permintaan?.nomor || "-"}
                </Text>
              </View>
              {data?.keterangan && (
                <View style={styles.row}>
                  <Text style={styles.label}>Keterangan</Text>
                  <Text style={styles.value}>: {data.keterangan}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={[{ marginTop: 20 }, styles.table]}>
          <View style={styles.tableRow}>
            <Text style={[styles.cell, styles.headerCell, styles.noCell]}>
              No
            </Text>
            <Text style={[styles.cell, styles.headerCell, styles.codeCell]}>
              Code
            </Text>
            <Text style={[styles.cell, styles.headerCell, styles.namaCell]}>
              Nama
            </Text>
            <Text style={[styles.cell, styles.headerCell, { width: 70 }]}>
              Gambar
            </Text>
            <Text style={[styles.cell, styles.headerCell, styles.qtyCell]}>
              QTY
            </Text>
            <Text style={[styles.cell, styles.headerCell, styles.satuanCell]}>
              Satuan
            </Text>
            <Text style={[styles.cell, styles.headerCell, { width: 100 }]}>
              Harga
            </Text>
            <Text style={[styles.cell, styles.headerCell, { width: 100 }]}>
              Total
            </Text>
          </View>
          {data?.confirmationDetails?.map((item, index) => {
            const price = item.material?.price || 0;
            const total = item.qty * price;

            return (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.cell, styles.noCell]}>{index + 1}</Text>
                <Text style={[styles.cell, styles.codeCell]}>{item.code}</Text>
                <Text style={[styles.cell, styles.namaCell]}>
                  {capitalizeIndonesia(item.material?.name)}
                </Text>
                <View style={[styles.cell, styles.imageCell]}>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${item.material?.image}`}
                    style={styles.image}
                  />
                </View>
                <Text style={[styles.cell, styles.qtyCell]}>{item.qty}</Text>
                <Text style={[styles.cell, styles.satuanCell]}>
                  {item.satuan}
                </Text>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ width: 20, padding: 4 }}>Rp</Text>
                  <Text style={[styles.cell, styles.hargaCell]}>
                    {price.toLocaleString()}
                  </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ width: 20, padding: 4 }}>Rp</Text>
                  <Text style={[styles.cell, styles.totalCell]}>
                    {total.toLocaleString()}
                  </Text>
                </View>
              </View>
            );
          })}

          {/* TOTAL ROW */}
          <View style={styles.totalRow}>
            <Text
              style={{
                flex: 3,
                padding: 4,
                borderRightColor: "#ccc",
                borderRightWidth: 1,
              }}
            >
              Terbilang: {terbilang(totalHarga) || ""}
            </Text>
            <Text style={[styles.cell, { width: 100 }]}>Total</Text>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ width: 20, padding: 4 }}>Rp</Text>
              <Text style={[styles.cell, styles.totalCell]}>
                {totalHarga.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.signatureContainer}>
          {/* Judul */}
          <View style={styles.signatureRow}>
            <Text
              style={[
                styles.companyHeaderText,
                {
                  flex: 1,
                  borderBottomWidth: 1,
                  borderRightWidth: 1,
                },
              ]}
            >
              PT.REKA CIPTA INOVASI
            </Text>
            <Text
              style={[
                styles.companyHeaderText,
                { width: "25%", textAlign: "center" },
              ]}
            >
              Vendor
            </Text>
          </View>

          {/* Baris judul role */}
          <View style={[styles.signatureRow, { width: "75%" }]}>
            <Text style={styles.signatureHeaderCell}>Dibuat</Text>
            <Text style={styles.signatureHeaderCell}>Diperiksa</Text>
            <Text style={styles.signatureHeaderCell}>Disetujui</Text>
          </View>

          <View style={styles.signatureRow}>
            {["PURCHASING", "PIC_LAPANGAN", "SITE_MANAGER"].map((role) => {
              const signature = getSignatureByRole(role);
              return (
                <View
                  key={role}
                  style={[
                    styles.signatureBox,
                    {
                      borderRightWidth: 1,
                    },
                  ]}
                >
                  <View style={styles.boxQR}>
                    {signature?.qrCode && (
                      <Image style={styles.qrCode} src={signature.qrCode} />
                    )}
                  </View>
                  <Text style={styles.userName}>
                    {signature?.userName || "-"}
                  </Text>
                  <Text style={styles.roleLabel}>{role}</Text>
                </View>
              );
            })}
            <View style={styles.signatureBox}>
              <View style={styles.boxQR}></View>
              <Text style={styles.userName}>-</Text>
              <Text style={styles.roleLabel}>Vendor</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import { capitalizeIndonesia } from "@/utils/capitalizeIndonesia";

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 9 },

  // Header
  headerRow: { flexDirection: "row", justifyContent: "space-between" },
  title: { fontSize: 14, fontWeight: "bold" },
  title2: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    alignSelf: "flex-end",
  },
  logo: { width: 80, height: "auto" },

  // Container box (if needed)
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

  // Table Styles
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ccc",
    fontSize: 9,
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1 solid #ccc",
  },
  cell: {
    padding: 4,
    borderRight: "1 solid #ccc",
    fontSize: 9,
  },
  headerCell: {
    fontWeight: "bold",
    backgroundColor: "#e5e7eb",
    textAlign: "center",
  },

  noCell: { width: 25, textAlign: "center" },
  codeCell: { width: 60, textAlign: "center" },
  namaCell: { flex: 1 },
  qtyCell: { width: 40, textAlign: "center" },
  satuanCell: { width: 50, textAlign: "center" },

  // QR & Signature
  image: {
    width: 60,
    height: 60,
    alignSelf: "center",
  },
});

export const PermintaanPDF = ({ data, dataSign }) => {
  if (!data) return null;

  const getSignatureByRole = (role) =>
    Array.isArray(dataSign) ? dataSign.find((sig) => sig.role === role) : null;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Image src={`/assets/logo1.png`} style={styles.logo} />
            <Text style={styles.title}>PT. REKA CIPTA INOVASI</Text>
            <Text>Jl. Aluminium Perumahan Gatot Subroto Town House No.5</Text>
            <Text>Kel. Sei Sikambing C II, Kec. Medan Helvetia, Medan</Text>
            <Text>Sumatera Utara, 20213</Text>
          </View>

          <View>
            <Text style={styles.title2}>Permintaan Lapangan</Text>
            <View style={styles.container}>
              <View style={styles.row}>
                <Text style={styles.label}>Tanggal</Text>
                <Text style={styles.value}>
                  :{" "}
                  {data?.tanggal
                    ? new Date(data.tanggal).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "N/A"}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Nomor PL</Text>
                <Text style={styles.value}>: {data?.nomor || "N/A"}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Lokasi</Text>
                <Text style={styles.value}>: {data?.lokasi || "-"}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>PIC Lapangan</Text>
                <Text style={styles.value}>: {data?.picLapangan || "-"}</Text>
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

        {/* Table Permintaan */}
        <View style={styles.table}>
          <View style={[styles.tableRow, {backgroundColor: '#014BB1'}]}>
            <Text style={[styles.cell, styles.headerCell, styles.noCell]}>
              No
            </Text>
            <Text style={[styles.cell, styles.headerCell, styles.codeCell]}>
              Code
            </Text>
            <Text style={[styles.cell, styles.headerCell, styles.namaCell]}>
              Nama
            </Text>
            <Text style={[styles.cell, styles.headerCell, { flex: 1 }]}>
              Spesifikasi
            </Text>
            <Text style={[styles.cell, styles.headerCell, styles.qtyCell]}>
              QTY
            </Text>
            <Text style={[styles.cell, styles.headerCell, styles.satuanCell]}>
              Satuan
            </Text>
            <Text style={[styles.cell, styles.headerCell, { width: 100 }]}>
              Keterangan
            </Text>
            {/* <Text style={[styles.cell, styles.headerCell, { width: 80 }]}>
              Status
            </Text> */}
          </View>

          {data?.detail?.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.cell, styles.noCell]}>{index + 1}</Text>
              <Text style={[styles.cell, styles.codeCell]}>{item.code}</Text>
              <Text style={[styles.cell, styles.namaCell]}>
                {capitalizeIndonesia(item.materialName)}
              </Text>
              <Text style={[styles.cell, { flex: 1 }]}>{item.mention}</Text>
              <Text style={[styles.cell, styles.qtyCell]}>{item.qty}</Text>
              <Text style={[styles.cell, styles.satuanCell]}>
                {item.satuan}
              </Text>
              <Text style={[styles.cell, { width: 100 }]}>
                {item.keterangan}
              </Text>
              {/* <Text style={[styles.cell, { width: 80 }]}>{item.status}</Text> */}
            </View>
          ))}
        </View>

        <View style={[styles.table, { flexDirection: "row" }]}>
          {/* Kolom Informasi */}
          <View style={{ flex: 3, padding: 4 }}>
            {[
              ["Tanggal Delivery", data.tanggalDelivery],
              ["Lokasi Delivery", data.lokasi],
              ["Catatan", data.catatan],
              ["PIC Lapangan", data.picLapangan],
              ["Note", data.note],
            ].map(([label, value], index) => (
              <View
                style={[
                  styles.row,
                  { flexDirection: "row", paddingVertical: 2 },
                ]}
                key={index}
              >
                <Text style={{ width: 110, fontWeight: "bold" }}>{label}</Text>
                <Text style={{ marginHorizontal: 4 }}>:</Text>
                <Text style={{ flex: 1 }}>{value || ""}</Text>
              </View>
            ))}
          </View>

          {/* Kolom Tanda Tangan */}
          <View style={{ flex: 2, borderLeft: 1, borderColor: "#ccc" }}>
            {/* Header TTD */}
            <View style={[styles.row, { flexDirection: "row"}]}>
              <Text style={[styles.headerCell, { flex: 1, paddingVertical: 2 }]}>Diperiksa</Text>
              <Text style={[styles.headerCell, { flex: 1, paddingVertical: 2 }]}>Request By</Text>
            </View>

            {/* QR Code */}
            <View style={[styles.row, { flexDirection: "row", minHeight: 60 }]}>
              {["ENGINEER_CHECKER", "ENGINEER_REQUESTER"].map((role) => {
                const signature = getSignatureByRole(role);
                return (
                  <View
                    key={role}
                    style={{
                      flex: 1,
                      alignItems: "center",
                      paddingVertical: 2,
                    }}
                  >
                    {signature?.qrCode && (
                      <Image
                        src={signature.qrCode}
                        style={{ width: 60, height: 60 }}
                      />
                    )}
                  </View>
                );
              })}
            </View>

            {/* Nama Penandatangan */}
            <View style={[styles.row, { flexDirection: "row" }]}>
              {["ENGINEER_CHECKER", "ENGINEER_REQUESTER"].map((role) => {
                const signature = getSignatureByRole(role);
                return (
                  <Text
                    key={role}
                    style={{
                      flex: 1,
                      textAlign: "center",
                      fontSize: 9,
                      marginBottom: 2,
                    }}
                  >
                    {signature?.userName || "-"}
                  </Text>
                );
              })}
            </View>

            {/* Role Jabatan */}
            <View
              style={[styles.row, { flexDirection: "row", marginBottom: 0 }]}
            >
              <Text style={[styles.headerCell, { flex: 1, paddingVertical: 2  }]}>
                Project Manager
              </Text>
              <Text style={[styles.headerCell, { flex: 1, paddingVertical: 2  }]}>Site Manager</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

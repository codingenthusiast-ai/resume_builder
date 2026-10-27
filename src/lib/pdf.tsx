import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Resume } from "./schemas";
const styles = StyleSheet.create({
  page: {
    padding: 42,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.5,
    color: "#172554",
  },
  name: { fontSize: 24, fontFamily: "Helvetica-Bold", marginBottom: 5 },
  contact: { fontSize: 9, color: "#475569", marginBottom: 18 },
  section: { marginBottom: 13 },
  heading: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e1",
    paddingBottom: 3,
    marginBottom: 6,
  },
  body: { color: "#1e293b" },
});
export function ResumeDocument({ resume: r }: { resume: Resume }) {
  return (
    <Document title={`${r.name || "Resume"} — Resume`}>
      <Page size="A4" style={styles.page}>
        <Text
          style={[
            styles.name,
            r.template === "modern" ? { color: "#4F46E5" } : {},
          ]}
        >
          {r.name || "Your name"}
        </Text>
        <Text style={styles.contact}>
          {[r.email, r.phone, r.location, r.links]
            .filter(Boolean)
            .join("  |  ")}
        </Text>
        {r.sectionOrder
          .filter((key) => r[key].trim())
          .map((key) => (
            <View key={key} style={styles.section}>
              <Text style={styles.heading}>{key.toUpperCase()}</Text>
              <Text style={styles.body}>{r[key]}</Text>
            </View>
          ))}
      </Page>
    </Document>
  );
}

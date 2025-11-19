import React from "react";

export default function Panel({ title, children, actions }) {
  return (
    <section className="panel" style={{ minHeight: 420 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h2 style={{ margin: 0, fontSize: 16 }}>{title}</h2>
        <div style={{ display: "flex", gap: 8 }}>{actions}</div>
      </div>
      <div>{children}</div>
    </section>
  );
}

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


OUTPUT = "Reliability_Analytics_Dashboard_Workflow_Plan.pdf"


def p(text, style):
    return Paragraph(text, style)


def bullet(items, style):
    story = []
    for item in items:
        story.append(Paragraph(f"&bull; {item}", style))
    return story


def table(data, widths=None):
    t = Table(data, colWidths=widths, hAlign="LEFT")
    t.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0f172a")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
                ("FONTSIZE", (0, 0), (-1, -1), 8.5),
                ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#cbd5e1")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f8fafc")]),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    return t


def code_block(text, styles):
    return Paragraph(
        "<font name='Courier'>" + text.replace("\n", "<br/>").replace(" ", "&nbsp;") + "</font>",
        styles["Code"],
    )


def header_footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(colors.HexColor("#64748b"))
    canvas.drawString(inch * 0.65, 0.45 * inch, "Reliability Analytics Dashboard - Workflow Plan")
    canvas.drawRightString(A4[0] - inch * 0.65, 0.45 * inch, f"Page {doc.page}")
    canvas.restoreState()


def build():
    doc = SimpleDocTemplate(
        OUTPUT,
        pagesize=A4,
        rightMargin=0.65 * inch,
        leftMargin=0.65 * inch,
        topMargin=0.65 * inch,
        bottomMargin=0.65 * inch,
    )

    base = getSampleStyleSheet()
    styles = {
        "Title": ParagraphStyle(
            "Title",
            parent=base["Title"],
            fontSize=25,
            leading=30,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#0f172a"),
            spaceAfter=12,
        ),
        "Subtitle": ParagraphStyle(
            "Subtitle",
            parent=base["Normal"],
            fontSize=12,
            leading=18,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#475569"),
            spaceAfter=28,
        ),
        "H1": ParagraphStyle(
            "H1",
            parent=base["Heading1"],
            fontSize=16,
            leading=21,
            textColor=colors.HexColor("#0f172a"),
            spaceBefore=14,
            spaceAfter=8,
        ),
        "H2": ParagraphStyle(
            "H2",
            parent=base["Heading2"],
            fontSize=12,
            leading=16,
            textColor=colors.HexColor("#1e40af"),
            spaceBefore=10,
            spaceAfter=5,
        ),
        "Body": ParagraphStyle(
            "Body",
            parent=base["BodyText"],
            fontSize=9.5,
            leading=14,
            textColor=colors.HexColor("#1f2937"),
            alignment=TA_LEFT,
            spaceAfter=5,
        ),
        "Bullet": ParagraphStyle(
            "Bullet",
            parent=base["BodyText"],
            fontSize=9.3,
            leading=13,
            leftIndent=12,
            textColor=colors.HexColor("#1f2937"),
            spaceAfter=3,
        ),
        "Code": ParagraphStyle(
            "Code",
            parent=base["Code"],
            fontSize=7.6,
            leading=10,
            borderColor=colors.HexColor("#cbd5e1"),
            borderWidth=0.5,
            borderPadding=7,
            backColor=colors.HexColor("#f8fafc"),
            textColor=colors.HexColor("#111827"),
            spaceBefore=4,
            spaceAfter=8,
        ),
    }

    story = []
    story.append(Spacer(1, 0.55 * inch))
    story.append(p("Reliability Analytics Dashboard", styles["Title"]))
    story.append(p("Complete Hackathon Workflow Blueprint", styles["Subtitle"]))
    story.append(p("<b>Goal:</b> Give local vendors data to improve, not just complaints to ignore.", styles["Body"]))
    story.append(Spacer(1, 0.18 * inch))
    story.append(
        table(
            [
                ["Area", "Decision"],
                ["Frontend", "React + Vite + Tailwind CSS + Recharts + Axios"],
                ["Backend", "Node.js + Express + CORS"],
                ["Data", "Mock JSON only, with 10 vendor entries"],
                ["Frontend Port", "http://localhost:5173"],
                ["Backend Port", "http://localhost:5000"],
                ["Deployment", "Vercel for frontend, Render for backend"],
            ],
            [1.65 * inch, 4.7 * inch],
        )
    )
    story.append(PageBreak())

    story.append(p("1. Problem Understanding", styles["H1"]))
    story.append(
        p(
            "Local vendors in hyperlocal marketplaces have very little visibility into delivery success, complaint patterns, response time, ratings, and overall reliability. The solution is a dashboard that converts raw vendor performance data into simple, visual, actionable insights.",
            styles["Body"],
        )
    )
    story.extend(
        bullet(
            [
                "Admins can monitor all vendors and identify low performers.",
                "Vendors can understand their own reliability and weak areas.",
                "Judges see a working, visual, demo-friendly analytics product.",
            ],
            styles["Bullet"],
        )
    )

    story.append(p("2. User Roles And RBAC", styles["H1"]))
    story.append(
        table(
            [
                ["Feature", "Admin", "Vendor"],
                ["View all vendors", "Allowed", "Not allowed"],
                ["View own vendor profile", "Allowed", "Allowed"],
                ["View platform summary", "Allowed", "Not allowed"],
                ["Search and sort vendors", "Allowed", "Not allowed"],
                ["View complaint comparison chart", "Allowed", "Own data only"],
                ["View reliability score", "All vendors", "Own score only"],
                ["Flag low performers", "Allowed", "Not allowed"],
                ["Export reports", "Future feature", "Future feature"],
            ],
            [2.5 * inch, 1.75 * inch, 1.75 * inch],
        )
    )

    story.append(p("3. User Journey And Platform Workflow", styles["H1"]))
    story.append(p("<b>Admin journey:</b>", styles["H2"]))
    story.extend(
        bullet(
            [
                "Open dashboard and view summary cards.",
                "Compare vendors using charts and table.",
                "Search or sort vendors by score, complaints, or rating.",
                "Open vendor detail page for deeper analysis.",
                "Identify Good, Average, and Poor performers.",
            ],
            styles["Bullet"],
        )
    )
    story.append(p("<b>Vendor journey:</b>", styles["H2"]))
    story.extend(
        bullet(
            [
                "Open own vendor detail page.",
                "Check reliability score and status badge.",
                "Review completed vs failed orders.",
                "Analyze weekly delivery rate, complaints, response time, and rating.",
                "Use the dashboard to understand improvement areas.",
            ],
            styles["Bullet"],
        )
    )
    story.append(code_block("vendors.json\n    -> Express API computes score/status\n    -> React fetches data using Axios\n    -> Dashboard renders cards, charts, table, and detail views", styles))

    story.append(p("4. File Structure", styles["H1"]))
    story.append(
        code_block(
            """reliability-dashboard/
├── data/
│   ├── vendors.json      ← includes weeklyData array per vendor
│   └── complaints.json
├── server/
│   ├── index.js
│   └── routes/
│       ├── vendors.js
│       └── stats.js
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── SummaryCard.jsx
│   │   ├── VendorTable.jsx
│   │   ├── StatusBadge.jsx
│   │   └── ChartCard.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   └── VendorDetail.jsx
│   ├── App.jsx
│   └── main.jsx
└── package.json""",
            styles,
        )
    )

    story.append(p("5. Data Model", styles["H1"]))
    story.append(
        p(
            "Each vendor object must include delivery rate, average response time, rating, and embedded weeklyData. The project uses 10 vendors for the MVP.",
            styles["Body"],
        )
    )
    story.append(
        code_block(
            '''{
  "id": "v001",
  "name": "SupplyCo",
  "reliabilityScore": 87,
  "status": "good",
  "totalOrders": 320,
  "completedOrders": 278,
  "failedOrders": 42,
  "deliveryRate": 86.9,
  "totalComplaints": 5,
  "avgResponseTime": 12,
  "rating": 4.2,
  "region": "North",
  "weeklyData": [
    { "day": "Mon", "deliveryRate": 85, "complaints": 1 },
    { "day": "Tue", "deliveryRate": 90, "complaints": 0 }
  ]
}''',
            styles,
        )
    )

    story.append(p("6. API Contract And Backend Routes", styles["H1"]))
    story.append(
        table(
            [
                ["Endpoint", "Purpose", "Used By"],
                ["GET /api/vendors", "All vendors with computed reliabilityScore and status", "Dashboard, table, charts"],
                ["GET /api/vendors/:id", "Single vendor details with weeklyData", "Vendor detail page"],
                ["GET /api/summary", "totalVendors, avgReliabilityScore, topPerformer, totalComplaints", "Summary cards"],
                ["GET /api/stats/complaints", "Complaint analytics", "Complaints chart"],
                ["GET /api/stats/deliveries", "Delivery trend analytics", "Delivery line chart"],
            ],
            [1.75 * inch, 3.05 * inch, 1.6 * inch],
        )
    )
    story.append(p("<b>Route file plan:</b>", styles["H2"]))
    story.append(
        code_block(
            """routes/vendors.js
├── GET /api/vendors
└── GET /api/vendors/:id

routes/stats.js
├── GET /summary       → mounted as /api/summary
├── GET /complaints    → mounted as /api/stats/complaints
└── GET /deliveries    → mounted as /api/stats/deliveries""",
            styles,
        )
    )
    story.append(p("<b>Reliability calculation:</b>", styles["H2"]))
    story.append(code_block("reliabilityScore = Math.round((completedOrders / (completedOrders + failedOrders)) * 100)", styles))
    story.append(code_block("score > 80 = Good\nscore 60-80 = Average\nscore < 60 = Poor", styles))

    story.append(p("7. Frontend Component Plan", styles["H1"]))
    story.append(
        table(
            [
                ["Page/Component", "Responsibilities"],
                ["Dashboard.jsx", "Fetch summary/vendors, render cards, charts, search, sort, table"],
                ["VendorDetail.jsx", "Fetch single vendor, render score badge, pie chart, line chart, detail cards"],
                ["SummaryCard.jsx", "Reusable metric card for dashboard and vendor detail"],
                ["VendorTable.jsx", "Vendor rows with score, rating, complaints, and status badge"],
                ["StatusBadge.jsx", "Color-coded Good/Average/Poor display"],
                ["ChartCard.jsx", "Consistent chart container"],
            ],
            [2.0 * inch, 4.35 * inch],
        )
    )
    story.append(p("<b>Vendor Detail must include:</b>", styles["H2"]))
    story.extend(
        bullet(
            [
                "DeliveryLineChart using vendor weeklyData.",
                "SummaryCard - Avg Response Time using avgResponseTime.",
                "SummaryCard - Rating using rating.",
                "SummaryCard - Total Orders using totalOrders.",
                "PieChart for completedOrders vs failedOrders.",
            ],
            styles["Bullet"],
        )
    )

    story.append(p("8. Dashboard And Analytics Requirements", styles["H1"]))
    story.extend(
        bullet(
            [
                "Four summary cards: Total Vendors, Avg Reliability, Top Performer, Total Complaints.",
                "Bar chart for complaints per vendor.",
                "Line chart for weekly delivery rate trend.",
                "Vendor table with name, score, rating, complaints, and status.",
                "Search filter by vendor name.",
                "Sort by reliability score, complaints, or rating.",
                "Responsive design for laptop and mobile demo.",
            ],
            styles["Bullet"],
        )
    )

    story.append(p("9. Security, Authentication, And Verification", styles["H1"]))
    story.extend(
        bullet(
            [
                "MVP can simulate roles using a simple Admin/Vendor selector.",
                "Backend validates vendor ID and returns 404 for invalid vendors.",
                "CORS allows frontend to call backend.",
                "Use environment variable for frontend API base URL when deploying.",
                "Future version can add JWT login, bcrypt password hashing, OTP verification, protected routes, and audit logs.",
            ],
            styles["Bullet"],
        )
    )

    story.append(p("10. Team Split", styles["H1"]))
    story.append(
        table(
            [
                ["Team Member", "Ownership", "Tasks"],
                ["Person 1", "/data, README, Git, Deployment", "Create 10 vendors, merge branches, deploy, prepare screenshots"],
                ["Person 2", "/src", "Build React pages, components, charts, search/sort, UI polish"],
                ["Person 3", "/server", "Build Express routes, scoring logic, status logic, summary API"],
            ],
            [1.25 * inch, 2.25 * inch, 3.0 * inch],
        )
    )

    story.append(p("11. Demo Checklist", styles["H1"]))
    story.extend(
        bullet(
            [
                "GET /api/vendors returns 10 vendors.",
                "GET /api/summary returns correct summary data.",
                "GET /api/vendors/:id returns weeklyData.",
                "Vendor table shows 10 rows.",
                "Search and sort work.",
                "Charts render with real data.",
                "Vendor detail page shows avg response time, rating, and total orders.",
                "Frontend and backend are deployed or localhost backup is ready.",
            ],
            styles["Bullet"],
        )
    )

    story.append(p("12. Future Scalability Ideas", styles["H1"]))
    story.extend(
        bullet(
            [
                "Add real database using MongoDB or PostgreSQL.",
                "Add vendor/admin login with JWT and RBAC.",
                "Add ML prediction for future reliability score.",
                "Add automated alerts for poor performers.",
                "Add complaint category analysis and sentiment analysis.",
                "Add exportable PDF/CSV reports.",
                "Add location-wise and delivery-agent-wise analytics.",
            ],
            styles["Bullet"],
        )
    )

    story.append(p("Final MVP Goal", styles["H1"]))
    story.append(
        p(
            "A working Reliability Analytics Dashboard where admins can view vendor performance, compare reliability metrics, identify weak vendors, and open vendor detail pages with clear charts and scores.",
            styles["Body"],
        )
    )

    doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)


if __name__ == "__main__":
    build()

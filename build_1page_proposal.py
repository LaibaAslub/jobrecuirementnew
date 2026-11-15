import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import qn, nsdecls

# ── helpers ────────────────────────────────────────────────────────────────────

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=20, bottom=20, left=40, right=40):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(
        f'<w:tcMar {nsdecls("w")}>'
        f'<w:top w:w="{top}" w:type="dxa"/>'
        f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
        f'<w:left w:w="{left}" w:type="dxa"/>'
        f'<w:right w:w="{right}" w:type="dxa"/>'
        f'</w:tcMar>'
    )
    tcPr.append(tcMar)

def set_table_borders(table, color="CBD5E1", sz="4", val="single"):
    tblPr = table._tbl.tblPr
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'<w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:left w:val="none"/>'
        f'<w:right w:val="none"/>'
        f'<w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:insideV w:val="none"/>'
        f'</w:tblBorders>'
    )
    tblPr.append(borders)

# ── main document ──────────────────────────────────────────────────────────────

def generate_doc(output_path):
    doc = docx.Document()

    # Page setup – narrow margins to maximise usable area
    for section in doc.sections:
        section.top_margin    = Inches(0.40)
        section.bottom_margin = Inches(0.35)
        section.left_margin   = Inches(0.55)
        section.right_margin  = Inches(0.55)

        # Header
        header_p = section.header.paragraphs[0]
        header_p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        hr = header_p.add_run("JobBridge: Smart Job Portal  |  Project Proposal")
        hr.font.name = "Calibri"; hr.font.size = Pt(7.5)
        hr.font.color.rgb = RGBColor(100, 116, 139)

        # Footer
        footer_p = section.footer.paragraphs[0]
        footer_p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        fr = footer_p.add_run("BS Computer Science (BSCS)  --  7th Semester  |  Student: Aqsa")
        fr.font.name = "Calibri"; fr.font.size = Pt(7.5)
        fr.font.color.rgb = RGBColor(148, 163, 184)

    # Colour palette
    NAVY    = RGBColor(15, 23, 42)
    SLATE   = RGBColor(51, 65, 85)
    MUTED   = RGBColor(100, 116, 139)
    EMERALD = RGBColor(5, 150, 105)
    BF = 7.8
    LS = 1.0

    def add_run(p, text, *, bold=False, italic=False, size=BF, color=SLATE):
        r = p.add_run(text)
        r.font.name = "Calibri"; r.font.size = Pt(size)
        r.font.bold = bold; r.font.italic = italic
        r.font.color.rgb = color
        return r

    # ---- TITLE BLOCK ---------------------------------------------------------
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after  = Pt(0)
    add_run(p, "PROJECT PROPOSAL", bold=True, size=7.5, color=EMERALD)

    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after  = Pt(2)
    add_run(p, "JobBridge: Smart Job Portal", bold=True, size=16, color=NAVY)

    # Academic info bar (4 cells)
    tbl = doc.add_table(rows=1, cols=4)
    tbl.alignment = WD_TABLE_ALIGNMENT.LEFT
    tbl.autofit = False
    set_table_borders(tbl, color="E2E8F0", sz="4")
    items = [
        ("STUDENT",  "Aqsa"),
        ("PROGRAM",  "BS Computer Science (BSCS)"),
        ("SEMESTER", "7th Semester"),
        ("PLATFORM", "Next.js 16 + Supabase PostgreSQL"),
    ]
    for idx, (lbl, val) in enumerate(items):
        cell = tbl.rows[0].cells[idx]
        set_cell_background(cell, "F1F5F9")
        set_cell_margins(cell, top=16, bottom=16, left=36, right=36)
        cp = cell.paragraphs[0]
        cp.paragraph_format.space_after = Pt(0)
        add_run(cp, lbl + "\n", bold=True, size=6.2, color=MUTED)
        add_run(cp, val, bold=True, size=7.4, color=NAVY)

    spacer = doc.add_paragraph()
    spacer.paragraph_format.space_after = Pt(2)

    # ---- TWO-COLUMN LAYOUT ---------------------------------------------------
    col_tbl = doc.add_table(rows=1, cols=2)
    col_tbl.alignment = WD_TABLE_ALIGNMENT.LEFT
    col_tbl.autofit = False
    set_table_borders(col_tbl, color="FFFFFF", sz="0", val="none")

    LC = col_tbl.rows[0].cells[0]
    RC = col_tbl.rows[0].cells[1]
    LC.width = Inches(3.85)
    RC.width = Inches(3.85)
    set_cell_margins(LC, top=0, bottom=0, left=0,  right=40)
    set_cell_margins(RC, top=0, bottom=0, left=40, right=0)

    # -- cell helpers ----------------------------------------------------------
    def ch(cell, text, sb=3, sa=1):
        """Section heading inside a cell."""
        p = cell.add_paragraph()
        p.paragraph_format.space_before = Pt(sb)
        p.paragraph_format.space_after  = Pt(sa)
        p.paragraph_format.line_spacing = LS
        r = p.add_run(text)
        r.font.name = "Calibri"; r.font.size = Pt(8.8)
        r.font.bold = True; r.font.color.rgb = NAVY
        pPr = p._p.get_or_add_pPr()
        pBdr = OxmlElement('w:pBdr')
        bot  = OxmlElement('w:bottom')
        bot.set(qn('w:val'), 'single'); bot.set(qn('w:sz'), '4')
        bot.set(qn('w:space'), '1');    bot.set(qn('w:color'), '059669')
        pBdr.append(bot); pPr.append(pBdr)

    def cb(cell, text, bold_prefix=None, *, sa=1.0):
        """Body paragraph inside a cell."""
        p = cell.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after  = Pt(sa)
        p.paragraph_format.line_spacing = LS
        if bold_prefix:
            add_run(p, bold_prefix, bold=True, color=NAVY)
        add_run(p, text, color=SLATE)

    def cbul(cell, bp, text, *, sa=0.5):
        """Bullet inside a cell."""
        p = cell.add_paragraph(style='List Bullet')
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after  = Pt(sa)
        p.paragraph_format.line_spacing = LS
        add_run(p, bp, bold=True, color=NAVY)
        add_run(p, text, color=SLATE)

    def mini_table(parent_cell, col_widths, rows_data, hdr_bg="0F172A"):
        """Build a small compact table inside a cell."""
        tbl = parent_cell.add_table(rows=len(rows_data), cols=len(col_widths))
        tbl.autofit = False
        set_table_borders(tbl, color="CBD5E1", sz="4")
        for ri, row_data in enumerate(rows_data):
            row = tbl.rows[ri]
            for ci, val in enumerate(row_data):
                c = row.cells[ci]
                c.width = col_widths[ci]
                bg = hdr_bg if ri == 0 else ("F8FAFC" if ri % 2 == 0 else "FFFFFF")
                set_cell_background(c, bg)
                set_cell_margins(c, top=9, bottom=9, left=26, right=26)
                pp = c.paragraphs[0]
                pp.paragraph_format.space_after = Pt(0)
                pp.paragraph_format.line_spacing = 0.95
                txt_col = RGBColor(255, 255, 255) if ri == 0 else (NAVY if ci == 0 else SLATE)
                rr = pp.add_run(str(val))
                rr.font.name = "Calibri"; rr.font.size = Pt(6.2)
                rr.font.bold = (ri == 0 or ci == 0)
                rr.font.color.rgb = txt_col

    # ==========================================================================
    # LEFT COLUMN
    # ==========================================================================

    # 1. Overview
    ch(LC, "Overview & Problem Statement", sb=0)
    cb(LC,
        "JobBridge is a cloud-native, multi-role online recruitment platform that streamlines "
        "the complete talent-acquisition lifecycle. Legacy portals suffer from fragmented tracking, "
        "no real-time candidate feedback, and absent role-isolated workspaces. JobBridge delivers a "
        "unified ecosystem for three archetypes: Job Seekers, Employers, and Administrators.")

    # 2. Objectives
    ch(LC, "Objectives")
    cbul(LC, "Cloud DB & Secure Auth: ", "Supabase PostgreSQL with RLS, JWT, and role metadata persistence ('user'/'employer'/'admin').")
    cbul(LC, "Candidate Portfolio Studio: ", "Dynamic profiles with contact info, education, experience, and JSONB skill-mastery ratings.")
    cbul(LC, "Employer Vacancy Management: ", "Self-service portal to post vacancies with qualifications, deadlines, and vacancy counts.")
    cbul(LC, "Application Lifecycle Tracking: ", "Bidirectional status pipeline (Pending → Shortlisted / Rejected) with live dashboard feedback.")
    cbul(LC, "Admin Governance Center: ", "Platform-wide analytics, vacancy balancing, applicant review modals, and content moderation.")

    # 3. Key Features
    ch(LC, "Key Features & Modules")
    cbul(LC, "Discovery Portal: ", "Landing page with live stats, category badges, 'How It Works', and email newsletter.")
    cbul(LC, "Real-Time Search & Filter: ", "/jobs catalog with instant keyword search across titles and descriptions.")
    cbul(LC, "Deadline Gatekeeper: ", "Compares server timestamp vs. lastDate — expired listings show 'Closed', Apply disabled.")
    cbul(LC, "Profile Validation Gate: ", "Requires phone + address before submission; incomplete applications are rejected.")
    cbul(LC, "JSONB Skill Meters: ", "Visual % competency bars stored as {'Programming':70,'UI Design':85} — schema-free updates.")
    cbul(LC, "Vacancy Balancing: ", "Auto-recalculates Remaining = Total Vacancies − Shortlisted on every status update.")
    cbul(LC, "Role Workspaces: ",
        "Seeker: /profile, /dashboard, /jobs, /apply/[id]. "
        "Employer: /employer/dashboard, /jobs, /applications. "
        "Admin: /admin/jobs, /admin/applications, /dashboard.")

    # 4. Tech Stack
    ch(LC, "Technology Stack")
    mini_table(
        LC,
        [Inches(0.95), Inches(0.68), Inches(2.22)],
        [
            ("Technology", "Version", "Role in System"),
            ("Next.js",      "16.2.3", "App Router, SSR/CSR, dynamic routing"),
            ("React",        "19.2.4", "Hooks: useState, useEffect, useContext"),
            ("Supabase",     "2.103.0","Cloud BaaS: PostgreSQL + PostgREST + Auth"),
            ("PostgreSQL",   "v15+",   "ACID RDBMS, JSONB indexing, RLS policies"),
            ("Tailwind CSS", "v4.0+",  "Utility-first responsive design system"),
            ("Lucide React", "1.8.0",  "Vector icon library"),
            ("Node.js/npm",  "LTS",    "Runtime & package management"),
        ]
    )
    cb(LC, "", sa=1.0)   # small spacer after table

    # ==========================================================================
    # RIGHT COLUMN
    # ==========================================================================

    # 5. Architecture diagram
    ch(RC, "System Architecture & Workflow", sb=0)
    if os.path.exists("fig1_architecture_workflow.png"):
        p = RC.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(1)
        p.paragraph_format.space_after  = Pt(0)
        p.add_run().add_picture("fig1_architecture_workflow.png", width=Inches(3.72))
        cap = RC.add_paragraph()
        cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        cap.paragraph_format.space_after = Pt(2)
        add_run(cap, "Fig 1: Three-tier architecture (Presentation Layer → Context & Security → Supabase Cloud BaaS)",
                italic=True, size=6.3, color=MUTED)

    # 6. Database Design
    ch(RC, "Supabase Database Design")
    cb(RC,
        "Fully relational Supabase PostgreSQL database with PostgREST auto-generated REST APIs, "
        "JWT-based authentication, Row-Level Security (RLS), and cascading referential integrity "
        "across four core tables:", sa=1.5)

    mini_table(
        RC,
        [Inches(0.78), Inches(1.82), Inches(1.12)],
        [
            ("Table",        "Key Fields",                                                              "Purpose"),
            ("auth.users",   "id (UUID PK), email, raw_user_meta_data JSONB {role, fullName, companyName}", "Identity, JWT auth & role assignment"),
            ("jobs",         "id (UUID PK), employer_id (FK), title, description, qualification, ageLimit, lastDate, vacancies, category, color, employer_name", "Vacancy catalog; employer-scoped with deadline enforcement"),
            ("applications", "id (UUID PK), job_id (FK→jobs CASCADE), user_email (FK*→profiles), user_name, cv_name, status (Pending/Shortlisted/Rejected)", "Submission lifecycle management"),
            ("profiles",     "email (PK), fullName, phone, whatsapp, address, city, country, aboutMe, qualification, experience, skills (JSONB)", "Candidate digital portfolio; phone+address required"),
        ]
    )

    cb(RC, "", sa=1.0)
    cb(RC,
        "Constraints: auth.users 1:N jobs (employer_id FK), jobs 1:N applications (ON DELETE CASCADE), "
        "profiles 1:N applications (phone+address validated pre-submit). Index: "
        "CREATE INDEX idx_jobs_employer_id ON jobs(employer_id). "
        "UPSERT: supabase.from('profiles').upsert([payload],{onConflict:'email'}).", sa=2)

    # ER diagram
    if os.path.exists("fig2_database_er.png"):
        p = RC.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(1)
        p.paragraph_format.space_after  = Pt(0)
        p.add_run().add_picture("fig2_database_er.png", width=Inches(3.72))
        cap = RC.add_paragraph()
        cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        cap.paragraph_format.space_after = Pt(2)
        add_run(cap, "Fig 2: Supabase Entity-Relationship Schema — PKs, FKs, JSONB fields & relational cardinality",
                italic=True, size=6.3, color=MUTED)

    # 7. Expected Outcomes
    ch(RC, "Expected Outcomes")
    cbul(RC, "Responsive multi-role portal ", "accessible across desktop, tablet, and mobile browsers.")
    cbul(RC, "Three isolated workspaces ", "(Seeker, Employer, Admin) with strict JWT route protection.")
    cbul(RC, "Transparent hiring pipeline ", "eliminating the 'resume black hole' via real-time status feedback.")
    cbul(RC, "ACID-compliant Supabase DB ", "with RLS policies, indexed FKs, cascade integrity, and JSONB skills.")
    cbul(RC, "Admin analytics center ", "for hiring velocity monitoring, vacancy governance, and content moderation.", sa=0)

    # ── save ------------------------------------------------------------------
    doc.save(output_path)
    print(f"Saved: {output_path}")

if __name__ == "__main__":
    generate_doc("JobBridge_Proposal_1Page.docx")

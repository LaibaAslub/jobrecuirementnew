import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import qn, nsdecls

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=8, bottom=8, left=20, right=20):
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

def add_page_number_fields(run):
    fldSimple1 = OxmlElement('w:fldSimple')
    fldSimple1.set(qn('w:instr'), 'PAGE')
    run._r.append(fldSimple1)

def add_total_pages_field(run):
    fldSimple2 = OxmlElement('w:fldSimple')
    fldSimple2.set(qn('w:instr'), 'NUMPAGES')
    run._r.append(fldSimple2)

def generate_2page_proposal(output_path):
    doc = docx.Document()

    # Margins: 0.35 inches top/bottom, 0.52 inches left/right
    for section in doc.sections:
        section.top_margin = Inches(0.35)
        section.bottom_margin = Inches(0.35)
        section.left_margin = Inches(0.52)
        section.right_margin = Inches(0.52)

        # Header
        header = section.header
        header_p = header.paragraphs[0]
        header_p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        h_run = header_p.add_run("JobBridge: Smart Job Portal  |  Project Proposal")
        h_run.font.name = "Calibri"
        h_run.font.size = Pt(7.5)
        h_run.font.color.rgb = RGBColor(100, 116, 139)

        # Footer
        footer = section.footer
        footer_p = footer.paragraphs[0]
        footer_p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        f_run1 = footer_p.add_run("Submitted by: Laiba Aslub  |  BSCS (7th Semester)  —  Academic Final Year Project Proposal")
        f_run1.font.name = "Calibri"
        f_run1.font.size = Pt(7.5)
        f_run1.font.color.rgb = RGBColor(148, 163, 184)
        
        f_spacer = footer_p.add_run("\t\tPage ")
        f_spacer.font.name = "Calibri"
        f_spacer.font.size = Pt(7.5)
        f_spacer.font.color.rgb = RGBColor(100, 116, 139)
        add_page_number_fields(footer_p.add_run())
        f_mid = footer_p.add_run(" of ")
        f_mid.font.name = "Calibri"
        f_mid.font.size = Pt(7.5)
        f_mid.font.color.rgb = RGBColor(100, 116, 139)
        add_total_pages_field(footer_p.add_run())

    NAVY = RGBColor(15, 23, 42)
    SLATE = RGBColor(51, 65, 85)
    MUTED = RGBColor(100, 116, 139)
    EMERALD = RGBColor(5, 150, 105)

    body_pt = 7.5
    line_spacing = 0.98

    def add_title(text):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0.5)
        run = p.add_run(text)
        run.font.name = "Calibri"
        run.font.size = Pt(13.0)
        run.font.bold = True
        run.font.color.rgb = NAVY
        return p

    def add_subtitle(text):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(2.0)
        run = p.add_run(text)
        run.font.name = "Calibri"
        run.font.size = Pt(7.8)
        run.font.color.rgb = EMERALD
        run.font.bold = True
        return p

    def add_metadata_box(items):
        tbl = doc.add_table(rows=1, cols=len(items))
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        tbl.autofit = False
        set_table_borders(tbl, color="E2E8F0", sz="4")
        row = tbl.rows[0]
        for idx, (label, val) in enumerate(items):
            cell = row.cells[idx]
            set_cell_background(cell, "F8FAFC")
            set_cell_margins(cell, top=8, bottom=8, left=18, right=18)
            cp = cell.paragraphs[0]
            cp.alignment = WD_ALIGN_PARAGRAPH.LEFT
            cp.paragraph_format.space_after = Pt(0)
            
            r_lbl = cp.add_run(label + "\n")
            r_lbl.font.name = "Calibri"
            r_lbl.font.size = Pt(5.5)
            r_lbl.font.bold = True
            r_lbl.font.color.rgb = MUTED
            
            r_val = cp.add_run(val)
            r_val.font.name = "Calibri"
            r_val.font.size = Pt(6.5)
            r_val.font.bold = True
            r_val.font.color.rgb = NAVY
        doc.add_paragraph().paragraph_format.space_after = Pt(0.5)

    def add_h1(text, space_before=1.5, space_after=0.5):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(space_before)
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = "Calibri"
        run.font.size = Pt(8.2)
        run.font.bold = True
        run.font.color.rgb = NAVY
        return p

    def add_body(text, bold_prefix=None, space_after=0.5):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.line_spacing = line_spacing
        if bold_prefix:
            br = p.add_run(bold_prefix)
            br.font.name = "Calibri"
            br.font.size = Pt(body_pt)
            br.font.bold = True
            br.font.color.rgb = NAVY
        run = p.add_run(text)
        run.font.name = "Calibri"
        run.font.size = Pt(body_pt)
        run.font.color.rgb = SLATE
        return p

    def add_bullet(bold_prefix, text, space_after=0.4):
        p = doc.add_paragraph(style='List Bullet')
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.line_spacing = line_spacing
        if bold_prefix:
            br = p.add_run(bold_prefix)
            br.font.name = "Calibri"
            br.font.size = Pt(body_pt)
            br.font.bold = True
            br.font.color.rgb = NAVY
        run = p.add_run(text)
        run.font.name = "Calibri"
        run.font.size = Pt(body_pt)
        run.font.color.rgb = SLATE
        return p

    def add_diagram(img_path, caption_text, width_in=4.1, space_before=1.0, space_after=0.8):
        if os.path.exists(img_path):
            p = doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.space_before = Pt(space_before)
            p.paragraph_format.space_after = Pt(0.5)
            p.paragraph_format.keep_with_next = True
            run = p.add_run()
            run.add_picture(img_path, width=Inches(width_in))
            
            cap = doc.add_paragraph()
            cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
            cap.paragraph_format.space_before = Pt(0.5)
            cap.paragraph_format.space_after = Pt(space_after)
            c_run = cap.add_run(caption_text)
            c_run.font.name = "Calibri"
            c_run.font.size = Pt(6.0)
            c_run.font.italic = True
            c_run.font.color.rgb = MUTED

    def create_table(headers, data, col_widths=None, space_after=0.5):
        tbl = doc.add_table(rows=len(data) + 1, cols=len(headers))
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        tbl.autofit = False
        set_table_borders(tbl, color="CBD5E1", sz="4")

        hdr_row = tbl.rows[0]
        for idx, h_text in enumerate(headers):
            cell = hdr_row.cells[idx]
            if col_widths and idx < len(col_widths):
                cell.width = Inches(col_widths[idx])
            set_cell_background(cell, "0F172A")
            set_cell_margins(cell, top=6, bottom=6, left=18, right=18)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            p.paragraph_format.space_after = Pt(0)
            run = p.add_run(h_text)
            run.font.name = "Calibri"
            run.font.size = Pt(5.8)
            run.font.bold = True
            run.font.color.rgb = RGBColor(255, 255, 255)

        for r_idx, row_data in enumerate(data):
            row = tbl.rows[r_idx + 1]
            bg = "F8FAFC" if r_idx % 2 == 1 else "FFFFFF"
            for c_idx, val in enumerate(row_data):
                cell = row.cells[c_idx]
                if col_widths and c_idx < len(col_widths):
                    cell.width = Inches(col_widths[c_idx])
                set_cell_background(cell, bg)
                set_cell_margins(cell, top=5, bottom=5, left=18, right=18)
                p = cell.paragraphs[0]
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                p.paragraph_format.space_after = Pt(0)
                p.paragraph_format.line_spacing = 0.93
                run = p.add_run(str(val))
                run.font.name = "Calibri"
                run.font.size = Pt(5.8)
                run.font.color.rgb = SLATE
                if c_idx in [0, 1]:
                    run.font.bold = True
                    run.font.color.rgb = NAVY

        doc.add_paragraph().paragraph_format.space_after = Pt(space_after)

    # -------------------------------------------------------------
    # DOCUMENT CONTENT (Focused, Accurate, 2-Page Budget)
    # -------------------------------------------------------------

    add_title("PROJECT PROPOSAL: JOBBRIDGE: SMART JOB PORTAL")
    add_subtitle("An Intelligent, Multi-Role Online Recruitment & Talent Acquisition Platform")

    metadata = [
        ("STUDENT NAME", "Laiba Aslub"),
        ("ACADEMIC PROGRAM", "BS Computer Science (BSCS)"),
        ("SEMESTER", "7th Semester"),
        ("TECHNOLOGY STACK", "Next.js 16 • Supabase • PostgreSQL"),
    ]
    add_metadata_box(metadata)

    # 1. Introduction & Problem Statement
    add_h1("1. Introduction and Problem Statement", space_before=1.0)
    add_body(
        "Modern human resource management requires specialized web systems to eliminate inefficient email-based application screening and opaque hiring pipelines. Contemporary hiring suffers from unstructured resume transmissions, lack of real-time application status feedback for candidates ('Pending', 'Shortlisted', 'Rejected'), unmanaged job application deadlines, and an absence of dedicated, role-isolated portals for corporate recruiters and system administrators. We propose the development of JobBridge: Smart Job Portal, a modern, cloud-native online recruitment platform designed to streamline hiring workflows across three distinct user roles: Job Seekers, Employers, and Administrators. Powered by Next.js 16 and Supabase PostgreSQL, the proposed system will centralize job publishing, candidate portfolio management, and application lifecycle tracking."
    )

    # 2. Aim and Objectives
    add_h1("2. Aim of the Project and Key Objectives")
    add_body(
        "The project aims to develop a secure, multi-role recruitment web platform providing dedicated portals for job seekers, employers, and administrators backed by a real-time cloud database. Specific objectives include:"
    )
    add_bullet("1. Cloud Database Architecture: ", "Implement an ACID-compliant Supabase PostgreSQL database with Row-Level Security (RLS) and cascading foreign key constraints.")
    add_bullet("2. Role-Based Authentication: ", "Deploy Supabase Auth with custom metadata supporting Job Seeker ('user'), Employer, and Administrator personas with route guards.")
    add_bullet("3. Candidate Profile Studio: ", "Enable applicants to manage personal details, WhatsApp contact, address, bio, and percentage-based technical skills ratings.")
    add_bullet("4. Employer Vacancy Studio: ", "Build an employer portal for posting vacancies, enforcing application deadlines, and tracking applicant submissions.")
    add_bullet("5. Status Pipeline & Admin Tools: ", "Provide real-time status transitions (Pending, Shortlisted, Rejected), candidate inspection modals, and vacancy analytics.")

    # 3. System Architecture & Multi-Role Workflow
    add_h1("3. Proposed System Architecture and Workflow Pipeline")
    add_body(
        "The system follows a three-tier architecture: Next.js 16 App Router presentation layer, client-side AuthContext and DataContext state management, and Supabase cloud BaaS (PostgreSQL, PostgREST API, and Auth service). Figure 1 illustrates the high-level system architecture and multi-role operational workflow."
    )
    add_diagram("fig1_architecture_workflow.png", "Figure 1: High-Level System Architecture and Multi-Role Operational Workflow Pipeline of JobBridge: Smart Job Portal", width_in=4.1)

    # 4. Core Pages, Modules, and Functionality
    add_h1("4. Core Pages, Modules, and Website Functionality")
    add_bullet("Public Discovery Portal (/ & /jobs): ", "Interactive landing page with platform statistics, partner brand showcases, 'How It Works' workflow, and a live searchable job catalog with title/keyword search and category color badges.")
    add_bullet("Job Application Interface (/apply/[id]): ", "Permits authenticated candidates to apply with CV document references; automatically enforces lastDate deadline expiration ('Applications Closed' notice) and verifies profile completeness (phone & address) before submission.")
    add_bullet("Candidate Profile Studio (/profile): ", "Allows job seekers to edit personal details, phone, WhatsApp, residence, bio, and adjust percentage mastery bars for technical skills (stored in JSONB).")
    add_bullet("Job Seeker Dashboard (/dashboard): ", "Presents candidates with their submitted applications, applied positions, and real-time status badges (Pending, Shortlisted, Rejected).")
    add_bullet("Employer Portal (/employer/*): ", "Dedicated workspace (/employer/dashboard, /employer/jobs, /employer/applications) for company-scoped vacancy creation, active vs. expired job tracking, and one-click Shortlist/Reject actions on received applicants.")
    add_bullet("Administrator Command Center (/admin/*): ", "Provides system-wide metrics (total vacancies, remaining open slots, total applications, acceptance rate), full job management, and an applicant inspection modal revealing full skills and contact data.")

    # 5. Intelligent Evaluation & Gatekeeping Components
    add_h1("5. Intelligent Evaluation and Gatekeeping Mechanisms")
    add_bullet("Dynamic Skill Mastery Modeling: ", "Candidate competencies are stored as a dynamic JSONB key-value map (e.g. {'Programming': 70, 'UI Design': 85}), rendering live visual progress meters for rapid recruiter assessment.")
    add_bullet("Automated Deadline Expiration Gatekeeper: ", "The system checks current timestamps against the job lastDate. Expired listings display an 'Applications Closed' badge and disable apply buttons automatically.")
    add_bullet("Pre-Application Completeness Audit: ", "Validates that the applicant has registered a phone number and physical address prior to permitting application dispatch, preventing incomplete candidate submissions.")
    add_bullet("Real-Time Vacancy Balancing: ", "Calculates remaining open slots dynamically (Remaining = Total Vacancies - Shortlisted Candidates) across admin and employer views.")

    # 6. Technologies and Tools Stack Table
    add_h1("6. Technologies and Development Stack")
    tech_headers = ["Technology", "Classification", "Version", "Role in Proposed System"]
    tech_data = [
        ["Next.js", "Web Framework", "16.2.3", "App Router, Server/Client components, dynamic routing, and fast SSR/CSR."],
        ["React", "UI Library", "19.2.4", "Declarative UI rendering, component hooks (useState, useEffect, useContext)."],
        ["Supabase", "Cloud BaaS & DB", "2.103.0", "PostgreSQL database, PostgREST API client, and JWT-based Auth service."],
        ["PostgreSQL", "Relational Engine", "v15+", "ACID compliant relational data storage, JSONB indexing, RLS security policies."],
        ["Tailwind CSS", "Styling Engine", "v4.0+", "Utility-first design system delivering responsive layouts and visual themes."],
        ["Lucide React", "Iconography", "1.8.0", "Crisp vector icons enhancing usability across dashboards and navigation."]
    ]
    create_table(tech_headers, tech_data, [1.0, 1.1, 0.9, 4.2], space_after=0.5)

    # 7. Supabase Database Architecture Overview & Diagram (Clean overview, no detailed tables)
    add_h1("7. Supabase Relational Database Architecture and Overview")
    add_body(
        "The proposed platform utilizes Supabase PostgreSQL as its persistent relational backend. The architecture comprises four core entities designed specifically for the platform's multi-role data flow:"
    )
    add_bullet("auth.users: ", "Supabase Auth identity table storing user UUID, email, encrypted password, and raw_user_meta_data (role: 'user'|'employer'|'admin', fullName, and companyName).")
    add_bullet("jobs: ", "Catalog of vacancies storing position title, description, qualification prerequisites, ageLimit, lastDate (application closing deadline), vacancies count, category, color badge token, employer_id (FK to auth.users), and employer_name.")
    add_bullet("applications: ", "Candidate job submissions storing job_id (FK to jobs.id with ON DELETE CASCADE), job_title, user_email (logical FK to profiles), user_name, cv_name, status ('Pending', 'Shortlisted', 'Rejected'), and created_at.")
    add_bullet("profiles: ", "Candidate portfolios storing applicant email (Primary Key), names, phone, WhatsApp contact, address, city, country, aboutMe bio, qualification, experience, and a dynamic skills JSONB map storing percentage proficiencies.")

    add_body(
        "Figure 2 illustrates the complete Entity-Relationship diagram, specifying primary keys, foreign key constraints, and relational associations across all four database tables."
    )
    add_diagram("fig2_database_er.png", "Figure 2: Supabase Relational Database Schema and Entity-Relationship Architecture", width_in=4.4)

    # 8. Database Operations, Lifecycle Management, and Security
    add_h1("8. Database Operations, Relational Integrity, and Security")
    add_bullet("Job Posting & Deletion: ", "Employers and admins insert postings via supabase.from('jobs').insert([payload]), associating employer_id. Deleting a job triggers ON DELETE CASCADE, automatically removing all child applications.")
    add_bullet("Application Submission & Status Updates: ", "Candidates submit applications with status defaulting to 'Pending'. Employers and admins update status to 'Shortlisted' or 'Rejected' via supabase.from('applications').update({ status }).eq('id', appId), updating applicant dashboards in real time.")
    add_bullet("Profile Upsert & JSONB Mastery: ", "Candidate profiles are managed via PostgreSQL UPSERT (supabase.from('profiles').upsert([payload], { onConflict: 'email' })). The skills column stores dynamic competency percentages without requiring schema migrations.")
    add_bullet("Performance & Security: ", "An index is created on the foreign key (CREATE INDEX idx_jobs_employer_id ON jobs(employer_id)) for fast employer-scoped queries. Row-Level Security (RLS) policies are active across all tables.")

    # 9. Expected Outcomes and Conclusion
    add_h1("9. Expected Outcomes and Conclusion")
    add_body(
        "Upon completion, the proposed JobBridge: Smart Job Portal platform will deliver a complete, multi-role recruitment solution featuring three isolated portals (Job Seeker, Employer, Administrator), transparent real-time application tracking, automated deadline gatekeeping, and an ACID-compliant Supabase PostgreSQL cloud backend. By standardizing candidate portfolio evaluation and automating hiring administrative workflows, the proposed system will establish an efficient, accessible, and scalable digital recruitment platform suitable for contemporary organizational hiring needs."
    )

    doc.save(output_path)
    print(f"Generated 2-page proposal at: {output_path}")

if __name__ == "__main__":
    generate_2page_proposal("RecruitMe_Project_Proposal.docx")
    print("Done. Open RecruitMe_Project_Proposal.docx")

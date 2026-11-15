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

def set_cell_margins(cell, top=60, bottom=60, left=90, right=90):
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

def build_proposal_4page(output_path):
    doc = docx.Document()

    # Page Margins: 0.65 inches top/bottom, 0.7 inches left/right
    for section in doc.sections:
        section.top_margin = Inches(0.60)
        section.bottom_margin = Inches(0.60)
        section.left_margin = Inches(0.70)
        section.right_margin = Inches(0.70)

        # Header
        header = section.header
        header_p = header.paragraphs[0]
        header_p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        h_run = header_p.add_run("RecruitMe: Online Recruitment System  |  Project Proposal")
        h_run.font.name = "Calibri"
        h_run.font.size = Pt(8.5)
        h_run.font.color.rgb = RGBColor(100, 116, 139)

        # Footer
        footer = section.footer
        footer_p = footer.paragraphs[0]
        footer_p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        f_run1 = footer_p.add_run("Academic Final Year Project Proposal  —  Confidential")
        f_run1.font.name = "Calibri"
        f_run1.font.size = Pt(8.5)
        f_run1.font.color.rgb = RGBColor(148, 163, 184)
        
        f_spacer = footer_p.add_run("\t\tPage ")
        f_spacer.font.name = "Calibri"
        f_spacer.font.size = Pt(8.5)
        f_spacer.font.color.rgb = RGBColor(100, 116, 139)
        add_page_number_fields(footer_p.add_run())
        f_mid = footer_p.add_run(" of ")
        f_mid.font.name = "Calibri"
        f_mid.font.size = Pt(8.5)
        f_mid.font.color.rgb = RGBColor(100, 116, 139)
        add_total_pages_field(footer_p.add_run())

    NAVY = RGBColor(15, 23, 42)      # #0F172A
    SLATE = RGBColor(51, 65, 85)     # #334155
    MUTED = RGBColor(100, 116, 139)  # #64748B
    EMERALD = RGBColor(5, 150, 105)  # #059669

    def add_title(text):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(1)
        run = p.add_run(text)
        run.font.name = "Calibri"
        run.font.size = Pt(18)
        run.font.bold = True
        run.font.color.rgb = NAVY
        return p

    def add_subtitle(text):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(8)
        run = p.add_run(text)
        run.font.name = "Calibri"
        run.font.size = Pt(10)
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
            set_cell_margins(cell, top=50, bottom=50, left=70, right=70)
            cp = cell.paragraphs[0]
            cp.alignment = WD_ALIGN_PARAGRAPH.LEFT
            cp.paragraph_format.space_after = Pt(0)
            
            r_lbl = cp.add_run(label + "\n")
            r_lbl.font.name = "Calibri"
            r_lbl.font.size = Pt(7.5)
            r_lbl.font.bold = True
            r_lbl.font.color.rgb = MUTED
            
            r_val = cp.add_run(val)
            r_val.font.name = "Calibri"
            r_val.font.size = Pt(8.5)
            r_val.font.bold = True
            r_val.font.color.rgb = NAVY
        doc.add_paragraph().paragraph_format.space_after = Pt(4)

    def add_h1(text, space_before=7, space_after=2):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(space_before)
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = "Calibri"
        run.font.size = Pt(11.5)
        run.font.bold = True
        run.font.color.rgb = NAVY
        return p

    def add_h2(text, space_before=5, space_after=1.5):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(space_before)
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = "Calibri"
        run.font.size = Pt(10)
        run.font.bold = True
        run.font.color.rgb = SLATE
        return p

    def add_body(text, bold_prefix=None, space_after=2.5, line_spacing=1.08):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.line_spacing = line_spacing
        if bold_prefix:
            br = p.add_run(bold_prefix)
            br.font.name = "Calibri"
            br.font.size = Pt(8.5)
            br.font.bold = True
            br.font.color.rgb = NAVY
        run = p.add_run(text)
        run.font.name = "Calibri"
        run.font.size = Pt(8.5)
        run.font.color.rgb = SLATE
        return p

    def add_bullet(bold_prefix, text, space_after=2.0):
        p = doc.add_paragraph(style='List Bullet')
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.line_spacing = 1.06
        if bold_prefix:
            br = p.add_run(bold_prefix)
            br.font.name = "Calibri"
            br.font.size = Pt(8.5)
            br.font.bold = True
            br.font.color.rgb = NAVY
        run = p.add_run(text)
        run.font.name = "Calibri"
        run.font.size = Pt(8.5)
        run.font.color.rgb = SLATE
        return p

    def add_diagram(img_path, caption_text, width_in=6.8, space_before=4, space_after=4):
        if os.path.exists(img_path):
            p = doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.space_before = Pt(space_before)
            p.paragraph_format.space_after = Pt(1)
            p.paragraph_format.keep_with_next = True
            run = p.add_run()
            run.add_picture(img_path, width=Inches(width_in))
            
            cap = doc.add_paragraph()
            cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
            cap.paragraph_format.space_before = Pt(1)
            cap.paragraph_format.space_after = Pt(space_after)
            c_run = cap.add_run(caption_text)
            c_run.font.name = "Calibri"
            c_run.font.size = Pt(7.5)
            c_run.font.italic = True
            c_run.font.color.rgb = MUTED

    def create_table(headers, data, col_widths=None, space_after=3):
        tbl = doc.add_table(rows=len(data) + 1, cols=len(headers))
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        tbl.autofit = False
        set_table_borders(tbl, color="CBD5E1", sz="4")

        # Header Row
        hdr_row = tbl.rows[0]
        for idx, h_text in enumerate(headers):
            cell = hdr_row.cells[idx]
            if col_widths and idx < len(col_widths):
                cell.width = Inches(col_widths[idx])
            set_cell_background(cell, "0F172A")
            set_cell_margins(cell, top=40, bottom=40, left=60, right=60)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            p.paragraph_format.space_after = Pt(0)
            run = p.add_run(h_text)
            run.font.name = "Calibri"
            run.font.size = Pt(7.5)
            run.font.bold = True
            run.font.color.rgb = RGBColor(255, 255, 255)

        # Data Rows
        for r_idx, row_data in enumerate(data):
            row = tbl.rows[r_idx + 1]
            bg = "F8FAFC" if r_idx % 2 == 1 else "FFFFFF"
            for c_idx, val in enumerate(row_data):
                cell = row.cells[c_idx]
                if col_widths and c_idx < len(col_widths):
                    cell.width = Inches(col_widths[c_idx])
                set_cell_background(cell, bg)
                set_cell_margins(cell, top=30, bottom=30, left=60, right=60)
                p = cell.paragraphs[0]
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                p.paragraph_format.space_after = Pt(0)
                p.paragraph_format.line_spacing = 1.02
                run = p.add_run(str(val))
                run.font.name = "Calibri"
                run.font.size = Pt(7.5)
                run.font.color.rgb = SLATE
                if c_idx == 0:
                    run.font.bold = True
                    run.font.color.rgb = NAVY

        doc.add_paragraph().paragraph_format.space_after = Pt(space_after)

    # =========================================================================
    # PAGE 1: TITLE, INTRODUCTION, PROBLEM STATEMENT, AIM & OBJECTIVES, PROPOSED SYSTEM
    # =========================================================================
    add_title("PROJECT PROPOSAL: RECRUITME")
    add_subtitle("An Intelligent, Multi-Role Online Recruitment & Talent Acquisition Platform")

    metadata = [
        ("PROJECT DOMAIN", "Cloud Software Engineering & Database Systems"),
        ("TARGET STAKEHOLDERS", "Job Seekers, Corporate Employers, System Admins"),
        ("DATABASE PLATFORM", "Supabase PostgreSQL (BaaS with RLS Engine)"),
        ("FRONTEND FRAMEWORK", "Next.js 16 (App Router), React 19, Tailwind CSS"),
    ]
    add_metadata_box(metadata)

    add_h1("1. Introduction and Background", space_before=4)
    add_body(
        "Modern human resource management has transitioned rapidly toward digital platforms to accelerate hiring workflows, broaden talent reach, and establish structured evaluation standards. Despite the proliferation of general-purpose job portals, contemporary recruitment operations continue to suffer from fragmented application tracking, inadequate candidate portfolio management, and a lack of dedicated multi-stakeholder workspace isolation. Small-to-medium enterprises and specialized recruiting agencies often find enterprise ERP platforms excessively complex and cost-prohibitive, while basic classified job boards lack rigorous application lifecycle controls and profile analytics."
    )
    add_body(
        "To resolve these persistent challenges, this project proposes the conceptualization, architectural design, and full-stack development of RecruitMe—an intelligent, cloud-native Online Recruitment System. The proposed system will provide a unified digital ecosystem serving three distinct user archetypes: Job Seekers seeking transparent career progression, Employers requiring targeted vacancy distribution and applicant evaluation tools, and System Administrators requiring centralized oversight over platform governance, security compliance, and recruitment velocity metrics."
    )

    add_h1("2. Problem Statement")
    add_body(
        "Conventional recruitment channels and legacy job listing portals exhibit critical structural bottlenecks that impair organizational productivity and candidate engagement:"
    )
    add_bullet("Fragmented and Manual Screening Workflows: ", "Recruiters are inundated with unstructured resumes transmitted via generic email threads, resulting in high administrative latency, human evaluation error, and severe delays in candidate review.")
    add_bullet("Lack of Candidate Status Transparency: ", "Applicants frequently experience the 'resume black hole,' where no programmatic feedback is provided regarding whether an application is pending, shortlisted, or rejected.")
    add_bullet("Absence of Multi-Role Workspace Isolation: ", "Most lightweight web portals fail to implement granular, role-based interfaces, forcing employers and hiring managers to navigate cluttered layouts without dedicated hiring pipelines.")
    add_bullet("Unenforced Deadlines and Static Portfolios: ", "Job postings frequently remain open indefinitely without automated deadline enforcement, while applicant profiles are limited to static text fields rather than measurable, multidimensional skill matrices.")

    add_h1("3. Aim and Objectives")
    add_body(
        "The primary aim of this project is to propose, design, and develop a high-performance, responsive, and secure multi-role web-based recruitment platform that standardizes the complete talent acquisition lifecycle—spanning dynamic vacancy publication, profile-driven candidate submissions, intelligent competency evaluation, real-time application tracking, and administrative governance. To accomplish this aim, we will pursue the following specific objectives:"
    )
    add_bullet("1. Cloud Database & Backend Infrastructure: ", "We will construct a fully relational database schema on Supabase PostgreSQL, leveraging Row-Level Security (RLS) policies and automated PostgREST APIs for real-time data persistence.")
    add_bullet("2. Secure Role-Based Authentication: ", "We will implement an enterprise-grade authentication mechanism supporting Job Seeker, Employer, and Administrator personas with strict route protection, JWT token validation, and metadata role persistence.")
    add_bullet("3. Dynamic Candidate Portfolio Management: ", "We will engineer an interactive profile studio enabling job seekers to curate detailed professional identities, including contact metadata, educational history, work experience, and percentage-based technical skills ratings.")
    add_bullet("4. Employer Vacancy Management Studio: ", "We will build a self-service employer portal allowing verified organizations to post structured vacancies with qualification prerequisites, vacancy counts, and strict deadline enforcement.")
    add_bullet("5. Transparent Application Lifecycle Tracking: ", "We will develop a bidirectional tracking pipeline enabling employers and admins to transition candidate statuses (Pending, Shortlisted, Rejected) with immediate visual feedback across applicant dashboards.")
    add_bullet("6. Administrative Governance & Analytics Command Center: ", "We will implement an administrative executive dashboard featuring global platform aggregates, real-time vacancy balancing, applicant review modals, and system-wide content moderation.")

    add_h1("4. Proposed System and Solution Overview")
    add_body(
        "The proposed system will be built as a component-driven Single-Page Application (SPA) leveraging the Next.js 16 App Router architecture paired with Supabase Backend-as-a-Service (BaaS). The frontend will provide high-speed, reactive user interfaces styled via Tailwind CSS with specialized portal views for Job Seekers (/dashboard, /profile), Employers (/employer/dashboard, /employer/jobs, /employer/applications), and System Administrators (/admin/jobs, /admin/applications). The cloud backend will enforce database-level relational constraints, cascading integrity, and granular authentication policies."
    )

    # doc.add_page_break()

    # =========================================================================
    # PAGE 2: FEATURES, INTELLIGENCE, MODULES, ARCHITECTURE DIAGRAM, TECH STACK
    # =========================================================================
    add_h1("5. System Features and Functional Capabilities", space_before=2)
    add_body(
        "The proposed RecruitMe platform will incorporate a comprehensive suite of user-facing and administrative functionalities designed for seamless operational efficiency:"
    )
    add_bullet("Dynamic Public Discovery Portal: ", "An engaging landing page featuring platform statistics, partner brand showcases, 'How It Works' process breakdowns, category exploration badges, and an email newsletter subscription mechanism.")
    add_bullet("Real-Time Search & Filtering Engine: ", "The /jobs catalog will enable instant keyword searching across position titles and role descriptions, with color-coded category tags and real-time empty-state handling.")
    add_bullet("Automated Application Gatekeeper: ", "The system will automatically compare current server timestamps against job submission deadlines (lastDate). Expired listings will be marked as 'Closed' and dynamically disable application submission controls.")
    add_bullet("Pre-Application Profile Validation: ", "Prior to permitting candidate submissions, the platform will verify that the applicant's profile contains essential contact information (phone number, physical address), preventing incomplete submissions.")
    add_bullet("Interactive Candidate Skill Progress Bars: ", "Applicant profiles will render visual competency meters displaying percentage mastery across diverse technical domains, persisted dynamically in JSONB.")
    add_bullet("Employer Applicant Management Studio: ", "Employers will access dedicated applicant management tables featuring multi-parameter filters (by specific job posting, candidate status, or applicant keyword) with one-click status transitions.")

    add_h1("6. Intelligent Evaluation and Matching Components")
    add_body(
        "The proposed platform will integrate intelligent algorithmic mechanisms designed to automate candidate screening and streamline recruitment analytics:"
    )
    add_bullet("Dynamic Competency & Skill Mastery Modeling: ", "Rather than treating candidate qualifications as static text, the system will utilize a flexible JSONB skill evaluation matrix. Candidates will define percentage mastery scores across core technical skills (e.g., Programming, UI Design, Research), which the system will normalize to generate comparative candidate proficiency profiles.")
    add_bullet("Automated Eligibility & Completeness Gatekeeping: ", "The application engine will employ client-side and database-level validation logic to ensure that only eligible, fully documented candidates can submit applications. Submissions without requisite contact details or targeting closed vacancies will be rejected programmatically at the interface boundary.")
    add_bullet("Real-Time Vacancy Balancing Algorithm: ", "The admin and employer modules will feature dynamic vacancy calculation algorithms. As candidates are transitioned to 'Shortlisted' status, the platform will automatically recalculate remaining open positions against the authorized vacancy ceiling (Remaining = Total Vacancies - Shortlisted Candidates), maintaining operational hiring accuracy.")
    add_bullet("Predictive Hiring Analytics Visualizer: ", "The administrative command center will incorporate multi-month hiring velocity charts and skill distribution analytics, providing hiring leads with immediate visual telemetry regarding recruitment trends.")

    add_h1("7. Multi-Role Modules and System Architecture")
    add_body(
        "The proposed platform will enforce strict workspace separation across three designated user roles to guarantee privacy, operational efficiency, and role-appropriate tooling. Figure 1 delineates the end-to-end system architecture and multi-role operational workflow."
    )
    add_diagram("fig1_architecture_workflow.png", "Figure 1: High-Level System Architecture and Multi-Role Workflow Pipeline", width_in=6.9, space_before=3, space_after=3)

    add_h1("8. Technologies and Tools Stack")
    add_body("The proposed system will be built using modern, production-grade tools and frameworks selected for high performance, developer productivity, and scalability:")
    tech_headers = ["Technology / Tool", "Classification", "Version", "Role in Proposed System"]
    tech_data = [
        ["Next.js", "Web Framework", "16.2.3", "App Router, Server/Client components, dynamic routing, and fast SSR/CSR."],
        ["React", "UI Library", "19.2.4", "Declarative UI rendering, component hooks (useState, useEffect, useContext)."],
        ["Supabase", "Cloud BaaS & DB", "2.103.0", "PostgreSQL database, PostgREST API client, and JWT-based Auth service."],
        ["PostgreSQL", "Relational Engine", "v15+", "ACID compliant relational data storage, JSONB indexing, RLS security policies."],
        ["Tailwind CSS", "Styling Engine", "v4.0+", "Utility-first design system delivering responsive layouts and visual themes."],
        ["Lucide React", "Iconography", "1.8.0", "Crisp vector icons enhancing usability across dashboards and navigation."],
        ["Node.js & npm", "Runtime & Packages", "LTS", "Package dependency management and server runtime environment."]
    ]
    create_table(tech_headers, tech_data, [1.2, 1.2, 0.9, 3.6], space_after=1)

    # doc.add_page_break()

    # =========================================================================
    # PAGE 3: DATABASE ARCHITECTURE, ER DIAGRAM, AND DETAILED TABLES
    # =========================================================================
    add_h1("9. Database Design and Supabase Cloud Architecture", space_before=2)
    add_body(
        "The relational database represents the core data foundation of the RecruitMe platform. We will utilize Supabase, an enterprise-grade Backend-as-a-Service built on a PostgreSQL relational engine. Supabase provides instantaneous RESTful API generation via PostgREST, integrated JWT authentication, automated schema caching, and robust Row-Level Security (RLS) policies. Figure 2 illustrates the complete Entity-Relationship diagram, specifying exact primary keys, foreign key constraints, data types, and relational cardinality."
    )
    add_diagram("fig2_database_er.png", "Figure 2: Supabase Relational Database Schema and Entity-Relationship Architecture", width_in=6.9, space_before=3, space_after=3)

    add_h1("10. Detailed Database Tables and Field Specifications")
    add_body(
        "To ensure complete architectural clarity, every database table planned for the RecruitMe platform is documented below with its exact fields, data types, constraints, and functional purpose based directly on the project's SQL schema:"
    )

    add_h2("10.1 Table: jobs (Job Vacancies Catalog)")
    jobs_headers = ["Field Name", "Data Type", "Constraints", "Description & Usage"]
    jobs_data = [
        ["id", "UUID", "PRIMARY KEY, DEFAULT gen_random_uuid()", "Unique 128-bit identifier generated automatically for each job posting."],
        ["title", "TEXT", "NOT NULL", "Official job position title (e.g., 'Senior Frontend Engineer', 'UI/UX Lead')."],
        ["description", "TEXT", "NOT NULL", "Comprehensive description of job responsibilities, requirements, and benefits."],
        ["qualification", "TEXT", "NULLABLE", "Academic qualification or certifications required (e.g., 'BS in Computer Science')."],
        ["ageLimit", "TEXT", "NULLABLE", "Prescribed candidate age restrictions for the position (e.g., '21-35 Years')."],
        ["lastDate", "TEXT", "NULLABLE", "Application closing deadline formatted as ISO date string for automated expiration checks."],
        ["vacancies", "INTEGER", "DEFAULT 1", "Total number of open positions authorized for hiring under this listing."],
        ["category", "TEXT", "NULLABLE", "Professional job classification domain (e.g., 'Engineering', 'Design', 'Marketing')."],
        ["color", "TEXT", "NULLABLE", "Visual theme identifier applied to category badges and job card styling on the frontend."],
        ["employer_id", "UUID", "FOREIGN KEY -> auth.users(id) ON DELETE SET NULL / CASCADE", "Links the job listing to the authenticated employer account that created the posting."],
        ["employer_name", "TEXT", "DEFAULT ''", "Denormalized organization or company name for high-speed query rendering."],
        ["created_at", "TIMESTAMPTZ", "DEFAULT NOW()", "Automated timestamp recording when the job posting was published."]
    ]
    create_table(jobs_headers, jobs_data, [1.0, 1.0, 1.8, 3.1], space_after=2)

    add_h2("10.2 Table: applications (Candidate Submissions)")
    app_headers = ["Field Name", "Data Type", "Constraints", "Description & Usage"]
    app_data = [
        ["id", "UUID", "PRIMARY KEY, DEFAULT gen_random_uuid()", "Unique identifier automatically assigned to each submitted job application."],
        ["job_id", "UUID", "FOREIGN KEY -> jobs(id) ON DELETE CASCADE", "Relational reference to target job vacancy. Deleting a job cascades to its applications."],
        ["job_title", "TEXT", "NULLABLE", "Denormalized position title recorded at time of submission for fast listing displays."],
        ["user_email", "TEXT", "NOT NULL, Logical FK -> profiles(email)", "Applicant email address, serving as a foreign key linking to the applicant's profile."],
        ["user_name", "TEXT", "NOT NULL", "Full legal name of the candidate submitting the application."],
        ["cv_name", "TEXT", "NULLABLE", "Document filename or identifier representing the candidate's uploaded resume/CV."],
        ["status", "TEXT", "DEFAULT 'Pending'", "Lifecycle state of the submission: 'Pending' (initial), 'Shortlisted', or 'Rejected'."],
        ["created_at", "TIMESTAMPTZ", "DEFAULT NOW()", "Timestamp documenting the exact moment the application was lodged."]
    ]
    create_table(app_headers, app_data, [1.0, 1.0, 1.8, 3.1], space_after=2)

    add_h2("10.3 Table: profiles (Candidate Portfolios & Credentials)")
    prof_headers = ["Field Name", "Data Type", "Constraints", "Description & Usage"]
    prof_data = [
        ["email", "TEXT", "PRIMARY KEY", "Unique email address identifying the job seeker, matching their auth credentials."],
        ["fullName / names", "TEXT", "NULLABLE", "Legal first, middle, last, and combined display name for applicant tables."],
        ["phone", "TEXT", "NULLABLE", "Primary telephone contact number, required by the application gatekeeper."],
        ["whatsapp", "TEXT", "NULLABLE", "Instant messaging number for direct recruiter outreach and interview scheduling."],
        ["address / city / country", "TEXT", "NULLABLE", "Physical residential address and location metadata, validated before applying."],
        ["aboutMe / qualification", "TEXT", "NULLABLE", "Professional biographical summary and highest degree attained."],
        ["experience", "TEXT", "NULLABLE", "Cumulative professional experience summary (e.g., '5+ Years in Full-Stack Dev')."],
        ["skills", "JSONB", "NULLABLE", "Flexible JSON key-value map storing technical skills and mastery percentages."],
        ["created_at", "TIMESTAMPTZ", "DEFAULT NOW()", "Timestamp recording initial candidate profile registration."]
    ]
    create_table(prof_headers, prof_data, [1.1, 1.0, 1.7, 3.1], space_after=2)

    add_h2("10.4 Table: auth.users (Supabase Identity & Authentication)")
    auth_headers = ["Field Name", "Data Type", "Constraints", "Description & Usage"]
    auth_data = [
        ["id", "UUID", "PRIMARY KEY", "Unique cryptographic subject identifier (UUID) assigned to each registered user."],
        ["email", "TEXT", "UNIQUE, NOT NULL", "User login email address, normalized to lowercase to prevent duplicate accounts."],
        ["encrypted_password", "TEXT", "NOT NULL", "Cryptographic one-way hash (bcrypt salted) storing user password securely."],
        ["raw_user_meta_data", "JSONB", "NULLABLE", "Structured JSON object storing custom attributes: fullName, role, companyName."],
        ["created_at", "TIMESTAMPTZ", "DEFAULT NOW()", "Timestamp recording account creation and verification status."]
    ]
    create_table(auth_headers, auth_data, [1.1, 1.0, 1.7, 3.1], space_after=1)

    # doc.add_page_break()

    # =========================================================================
    # PAGE 4: DATA OPERATIONS, INTEGRITY, OUTCOMES, AND CONCLUSION
    # =========================================================================
    add_h1("11. Database Operations, Lifecycle Management, and Security", space_before=2)
    add_body(
        "The proposed system will implement disciplined CRUD (Create, Read, Update, Delete) data operations and security controls across all entities:"
    )
    add_bullet("Job Management Lifecycle: ", "Employers and administrators will insert new postings via the Post Job interface, automatically associating the user's UUID into employer_id. DataContext will dispatch SQL queries via Supabase PostgREST client: supabase.from('jobs').insert([payload]). Deleting a job executes a cascaded deletion of all associated candidate applications (ON DELETE CASCADE), preventing orphaned database records.")
    add_bullet("Application Submission & State Transitions: ", "When a candidate applies, the system verifies that the job's lastDate has not passed and that the applicant's profile possesses valid phone and address values. Upon passing validation, an application record is inserted with status defaulting to 'Pending'. Employers and administrators can update the status column to 'Shortlisted' or 'Rejected' via supabase.from('applications').update({ status }).eq('id', appId), which immediately updates applicant dashboard cards.")
    add_bullet("Profile Upsert & JSONB Mastery Storage: ", "Profile updates will utilize PostgreSQL UPSERT mechanics (supabase.from('profiles').upsert([payload], { onConflict: 'email' })). The skills column leverages native PostgreSQL JSONB formatting (e.g., {'Programming': 70, 'UI Design': 85}), allowing candidates to update and add arbitrary competencies without requiring schema alterations.")
    add_bullet("Row-Level Security (RLS) & Indices: ", "To guarantee rapid query execution, an index will be deployed on the foreign key column (CREATE INDEX idx_jobs_employer_id ON jobs(employer_id)). Row-Level Security (RLS) will be activated across all tables to enforce access boundaries.")

    add_h1("12. Relational Integrity and Business Rules")
    add_body("The proposed system enforces critical relational rules to guarantee system reliability and consistent business logic:")
    add_bullet("Multi-Tenant Role Isolation (1 : N): ", "auth.users securely manages identity and assigns roles ('user', 'employer', 'admin'). Employers are tied to their postings via employer_id, ensuring strict workspace isolation.")
    add_bullet("Cascading Job Deletions (1 : N): ", "jobs.id is referenced by applications.job_id with ON DELETE CASCADE constraint. Removing a job cleanly removes candidate applications without leaving broken relational links.")
    add_bullet("Profile-Application Association (1 : N): ", "applications.user_email references profiles.email. Applications require a completed profile (phone & address) before submission, ensuring recruiters always receive actionable contact data.")
    add_bullet("Application Lifecycle Pipeline: ", "Every application defaults to 'Pending'. Employers and Administrators update status to 'Shortlisted' or 'Rejected', updating live applicant dashboards and recalculating open vacancy tallies.")

    add_h1("13. Expected Outcomes and Deliverables")
    add_body("Upon successful execution and development, the proposed RecruitMe project will deliver the following concrete outcomes:")
    add_bullet("1. Enterprise-Grade Web Platform: ", "A fully responsive, multi-role online recruitment portal accessible across desktop, tablet, and mobile browsers.")
    add_bullet("2. Dedicated Workspace Isolation: ", "Three isolated, role-tailored portals guaranteeing that Job Seekers, Corporate Employers, and System Administrators perform their designated tasks without interface overlap.")
    add_bullet("3. Transparent Hiring Pipeline: ", "An automated, transparent application tracking system that eliminates the 'resume black hole' by providing real-time status feedback.")
    add_bullet("4. Scalable Cloud Database Architecture: ", "A fully documented, ACID-compliant Supabase PostgreSQL database schema complete with relational constraints, indexed foreign keys, and RLS policies.")
    add_bullet("5. Automated Hiring Governance: ", "An administrative command center capable of monitoring hiring velocity, tracking open vacancies, and governing platform-wide content.")

    add_h1("14. Conclusion")
    add_body(
        "The proposed RecruitMe Online Recruitment System represents an innovative, cloud-native response to the inefficiencies, opacity, and fragmentation currently plaguing talent acquisition workflows. By combining Next.js 16, React 19, and Supabase PostgreSQL into a coherent multi-tier architecture, the proposed system will bridge the communication gap between ambitious job seekers, dynamic employers, and administrative overseers. The granular role separation, automated application gatekeepers, dynamic skill matrices, and transparent status lifecycles will establish an accessible, reliable, and scalable recruitment ecosystem. This project demonstrates significant academic rigor and practical utility, establishing a solid engineering foundation for contemporary cloud software development and modern human resource technologies."
    )

    doc.save(output_path)
    print(f"Proposal written successfully to: {output_path}")

if __name__ == "__main__":
    build_proposal_4page("RecruitMe_Project_Proposal.docx")

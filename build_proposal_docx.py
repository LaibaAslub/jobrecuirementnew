import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import qn, nsdecls

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=140, right=140):
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

def build_docx(output_path):
    doc = docx.Document()

    # Page Margins: 0.75 inches for optimal density & 4-page target
    for section in doc.sections:
        section.top_margin = Inches(0.7)
        section.bottom_margin = Inches(0.7)
        section.left_margin = Inches(0.75)
        section.right_margin = Inches(0.75)

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
        f_run1 = footer_p.add_run("Confidential  —  Academic Final Year Project Proposal")
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

    # Styling Helpers
    NAVY = RGBColor(15, 23, 42)      # #0F172A
    SLATE = RGBColor(51, 65, 85)     # #334155
    MUTED = RGBColor(100, 116, 139)  # #64748B
    EMERALD = RGBColor(5, 150, 105)  # #059669

    def add_title(text):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(2)
        run = p.add_run(text)
        run.font.name = "Calibri"
        run.font.size = Pt(22)
        run.font.bold = True
        run.font.color.rgb = NAVY
        return p

    def add_subtitle(text):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(12)
        run = p.add_run(text)
        run.font.name = "Calibri"
        run.font.size = Pt(11)
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
            set_cell_margins(cell, top=80, bottom=80, left=100, right=100)
            cp = cell.paragraphs[0]
            cp.alignment = WD_ALIGN_PARAGRAPH.LEFT
            cp.paragraph_format.space_after = Pt(0)
            
            r_lbl = cp.add_run(label + "\n")
            r_lbl.font.name = "Calibri"
            r_lbl.font.size = Pt(8.5)
            r_lbl.font.bold = True
            r_lbl.font.color.rgb = MUTED
            
            r_val = cp.add_run(val)
            r_val.font.name = "Calibri"
            r_val.font.size = Pt(9.5)
            r_val.font.bold = True
            r_val.font.color.rgb = NAVY
        doc.add_paragraph().paragraph_format.space_after = Pt(6)

    def add_h1(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(12)
        p.paragraph_format.space_after = Pt(3)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = "Calibri"
        run.font.size = Pt(13.5)
        run.font.bold = True
        run.font.color.rgb = NAVY
        return p

    def add_h2(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(8)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = "Calibri"
        run.font.size = Pt(11)
        run.font.bold = True
        run.font.color.rgb = SLATE
        return p

    def add_body(text, bold_prefix=None, space_after=3.5):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.line_spacing = 1.12
        if bold_prefix:
            br = p.add_run(bold_prefix)
            br.font.name = "Calibri"
            br.font.size = Pt(9.5)
            br.font.bold = True
            br.font.color.rgb = NAVY
        run = p.add_run(text)
        run.font.name = "Calibri"
        run.font.size = Pt(9.5)
        run.font.color.rgb = SLATE
        return p

    def add_bullet(bold_prefix, text):
        p = doc.add_paragraph(style='List Bullet')
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(2.5)
        p.paragraph_format.line_spacing = 1.10
        if bold_prefix:
            br = p.add_run(bold_prefix)
            br.font.name = "Calibri"
            br.font.size = Pt(9.5)
            br.font.bold = True
            br.font.color.rgb = NAVY
        run = p.add_run(text)
        run.font.name = "Calibri"
        run.font.size = Pt(9.5)
        run.font.color.rgb = SLATE
        return p

    def add_diagram(img_path, caption_text, width_in=6.8):
        if os.path.exists(img_path):
            p = doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.space_before = Pt(6)
            p.paragraph_format.space_after = Pt(2)
            p.paragraph_format.keep_with_next = True
            run = p.add_run()
            run.add_picture(img_path, width=Inches(width_in))
            
            cap = doc.add_paragraph()
            cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
            cap.paragraph_format.space_before = Pt(1)
            cap.paragraph_format.space_after = Pt(8)
            c_run = cap.add_run(caption_text)
            c_run.font.name = "Calibri"
            c_run.font.size = Pt(8.5)
            c_run.font.italic = True
            c_run.font.color.rgb = MUTED

    def create_table(headers, data, col_widths=None):
        tbl = doc.add_table(rows=len(data) + 1, cols=len(headers))
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        tbl.autofit = False
        set_table_borders(tbl, color="CBD5E1", sz="4")

        # Header Row
        hdr_row = tbl.rows[0]
        tblPr = tbl._tbl.tblPr
        for idx, h_text in enumerate(headers):
            cell = hdr_row.cells[idx]
            if col_widths and idx < len(col_widths):
                cell.width = Inches(col_widths[idx])
            set_cell_background(cell, "0F172A")
            set_cell_margins(cell, top=70, bottom=70, left=90, right=90)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            p.paragraph_format.space_after = Pt(0)
            run = p.add_run(h_text)
            run.font.name = "Calibri"
            run.font.size = Pt(8.5)
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
                set_cell_margins(cell, top=50, bottom=50, left=90, right=90)
                p = cell.paragraphs[0]
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                p.paragraph_format.space_after = Pt(0)
                p.paragraph_format.line_spacing = 1.05
                run = p.add_run(str(val))
                run.font.name = "Calibri"
                run.font.size = Pt(8.5)
                run.font.color.rgb = SLATE
                if c_idx == 0:
                    run.font.bold = True
                    run.font.color.rgb = NAVY

        doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # -------------------------------------------------------------
    # DOCUMENT GENERATION
    # -------------------------------------------------------------

    # Header / Title Block
    add_title("PROJECT PROPOSAL: RECRUITME")
    add_subtitle("An Intelligent, Multi-Role Online Recruitment & Talent Acquisition System")

    metadata = [
        ("PROJECT DOMAIN", "Cloud Software Engineering & Database Systems"),
        ("TARGET STAKEHOLDERS", "Job Seekers, Corporate Employers, System Admins"),
        ("DATABASE PLATFORM", "Supabase PostgreSQL (BaaS with RLS)"),
        ("FRONTEND FRAMEWORK", "Next.js 16 (App Router), React 19, Tailwind CSS"),
    ]
    add_metadata_box(metadata)

    # 1. Introduction / Background
    add_h1("1. Introduction and Background")
    add_body(
        "Modern human resource management has transitioned rapidly toward digital platforms to accelerate hiring workflows, broaden candidate reach, and establish structured evaluation standards. Despite the proliferation of general-purpose job portals, contemporary recruitment operations continue to suffer from fragmented application tracking, inadequate candidate portfolio management, and a lack of dedicated multi-stakeholder workspace isolation. Small-to-medium enterprises and specialized recruiting agencies often find enterprise ERP platforms excessively complex and cost-prohibitive, while basic classified job boards lack rigorous application lifecycle controls and profile analytics."
    )
    add_body(
        "To resolve these persistent challenges, this project proposes the conceptualization, architectural design, and full-stack development of RecruitMe—an intelligent, cloud-native Online Recruitment System. The proposed system will provide a unified digital ecosystem serving three distinct user archetypes: Job Seekers seeking transparent career progression, Employers requiring targeted vacancy distribution and applicant evaluation tools, and System Administrators requiring centralized oversight over platform governance, security compliance, and recruitment velocity metrics."
    )

    # 2. Problem Statement
    add_h1("2. Problem Statement")
    add_body(
        "Conventional recruitment channels and legacy job listing portals exhibit critical structural bottlenecks that impair organizational productivity and candidate engagement:"
    )
    add_bullet("Fragmented and Manual Screening Workflows: ", "Recruiters are inundated with unstructured resumes transmitted via generic email threads, resulting in high administrative latency, human evaluation error, and severe delays in candidate review.")
    add_bullet("Lack of Candidate Status Transparency: ", "Applicants frequently experience the 'resume black hole,' where no programmatic feedback is provided regarding whether an application is pending, shortlisted, or rejected.")
    add_bullet("Absence of Multi-Role Workspace Isolation: ", "Most lightweight web portals fail to implement granular, role-based interfaces, forcing employers and hiring managers to navigate cluttered, one-size-fits-all layouts without dedicated hiring pipelines.")
    add_bullet("Unenforced Deadlines and Static Portfolios: ", "Job postings frequently remain open indefinitely without automated deadline enforcement, while applicant profiles are limited to static text fields rather than measurable, multidimensional skill matrices.")

    # 3. Aim of the Project
    add_h1("3. Aim of the Project")
    add_body(
        "The primary aim of this project is to propose, design, and develop a high-performance, responsive, and secure multi-role web-based recruitment platform that standardizes the complete talent acquisition lifecycle—spanning dynamic vacancy publication, profile-driven candidate submissions, intelligent competency evaluation, real-time application tracking, and administrative governance."
    )

    # 4. Project Objectives
    add_h1("4. Project Objectives")
    add_body("To accomplish this aim, the proposed project will pursue the following specific technical and functional objectives:")
    add_bullet("1. Cloud Database & Backend Infrastructure: ", "We will construct a fully relational, scalable database schema on Supabase PostgreSQL, leveraging Row-Level Security (RLS) policies and automated PostgREST APIs for real-time data persistence.")
    add_bullet("2. Secure Role-Based Authentication: ", "We will implement an enterprise-grade authentication mechanism supporting Job Seeker, Employer, and Administrator personas with strict route protection, JWT token validation, and metadata role persistence.")
    add_bullet("3. Dynamic Candidate Portfolio Management: ", "We will engineer an interactive profile studio enabling job seekers to curate detailed professional identities, including contact metadata, educational history, work experience, and percentage-based technical skills ratings.")
    add_bullet("4. Employer Vacancy Management Studio: ", "We will build a self-service employer portal allowing verified organizations to post structured vacancies with qualification prerequisites, vacancy counts, and strict deadline enforcement.")
    add_bullet("5. Transparent Application Lifecycle Tracking: ", "We will develop a bidirectional tracking pipeline enabling employers and admins to transition candidate statuses (Pending, Shortlisted, Rejected) with immediate visual feedback across applicant dashboards.")
    add_bullet("6. Administrative Governance & Analytics Command Center: ", "We will implement an administrative executive dashboard featuring global platform aggregates, real-time vacancy balancing, applicant review modals, and system-wide content moderation.")

    # 5. Proposed System and Solution Architecture
    add_h1("5. Proposed System and Solution Architecture")
    add_body(
        "The proposed RecruitMe platform will be architected as a modular, cloud-native web application utilizing Next.js 16 with the React Server Component (RSC) paradigm, paired with Supabase as a Backend-as-a-Service (BaaS). The system will maintain a strict three-tier architecture comprising Presentation, Business Logic & Context State, and Cloud Data Storage. Figure 1 delineates the high-level system architecture."
    )
    add_diagram("diagram_architecture.png", "Figure 1: High-Level Three-Tier System Architecture of the Proposed RecruitMe Platform")

    add_body(
        "The presentation layer will deliver responsive, client-side views styled via a bespoke Tailwind CSS design system with micro-animations and accessibility standards. The business logic tier will utilize React Context providers (AuthContext and DataContext) to govern global authentication states, role-based navigation guards, client-side caching, and optimistic UI mutations. The cloud tier will encapsulate Supabase Auth and a robust PostgreSQL database engine equipped with declarative constraints, relational indices, and row-level security."
    )

    # 6. System Features and Functionalities
    add_h1("6. System Features and Functional Capabilities")
    add_body(
        "The proposed system will incorporate an extensive array of user-facing and back-office functionalities categorized into distinct functional modules:"
    )
    add_bullet("Dynamic Public Discovery Portal: ", "The platform will feature an engaging landing page with platform statistics, partner brand showcases, 'How It Works' process breakdowns, category exploration badges, and an email newsletter subscription mechanism.")
    add_bullet("Real-Time Search & Filtering Engine: ", "The /jobs catalog will enable instant keyword searching across position titles and role descriptions, with color-coded category tags and real-time empty-state handling.")
    add_bullet("Automated Application Gatekeeper: ", "The system will automatically compare current server timestamps against job submission deadlines (lastDate). Expired listings will be marked as 'Closed' and dynamically disable application submission controls.")
    add_bullet("Pre-Application Profile Validation: ", "Prior to permitting candidate submissions, the platform will verify that the applicant's profile contains essential contact information (phone number, physical address), preventing incomplete submissions.")
    add_bullet("Interactive Candidate Skill Progress Bars: ", "Applicant profiles will render visual competency meters displaying percentage mastery across diverse technical domains, persisted dynamically in JSONB.")
    add_bullet("Employer Applicant Management Studio: ", "Employers will access dedicated applicant management tables featuring multi-parameter filters (by specific job posting, candidate status, or applicant keyword) with one-click status transitions.")

    # 7. Intelligent Evaluation & Matching Components
    add_h1("7. Intelligent Evaluation and Matching Components")
    add_body(
        "The proposed platform will integrate intelligent algorithmic mechanisms designed to automate candidate screening and streamline recruitment analytics:"
    )
    add_bullet("Dynamic Competency & Skill Mastery Modeling: ", "Rather than treating candidate qualifications as static text, the system will utilize a flexible JSONB skill evaluation matrix. Candidates will define percentage mastery scores across core technical skills (e.g., Programming, UI Design, Research), which the system will normalize to generate comparative candidate proficiency profiles.")
    add_bullet("Automated Eligibility & Completeness Gatekeeping: ", "The application engine will employ client-side and database-level validation logic to ensure that only eligible, fully documented candidates can submit applications. Submissions without requisite contact details or those targeting closed vacancies will be rejected programmatically at the interface boundary.")
    add_bullet("Real-Time Vacancy Balancing Algorithm: ", "The admin and employer modules will feature dynamic vacancy calculation algorithms. As candidates are transitioned to 'Shortlisted' status, the platform will automatically recalculate remaining open positions against the authorized vacancy ceiling (Remaining = Total Vacancies - Shortlisted Candidates), maintaining operational hiring accuracy.")
    add_bullet("Predictive Hiring Analytics Visualizer: ", "The administrative command center will incorporate multi-month hiring velocity charts and skill distribution analytics, providing hiring leads with immediate visual telemetry regarding recruitment trends.")

    # 8. User, Employer, and Admin Modules
    add_h1("8. Multi-Role Modules and Workflow Pipeline")
    add_body(
        "The proposed platform will enforce strict workspace separation across three designated user roles to guarantee privacy, operational efficiency, and role-appropriate tooling. Figure 2 visualizes the end-to-end multi-role operational workflow."
    )
    add_diagram("diagram_workflow.png", "Figure 2: Multi-Role Recruitment Workflow and Application Lifecycle Pipeline")

    add_body(
        "Each stakeholder group will interact with tailor-made interfaces and permissions:", bold_prefix="Role Breakdown: "
    )
    add_bullet("Job Seeker Module: ", "Candidates will register personal accounts, maintain an extensive digital resume (/profile), browse active postings, upload document CV references, and monitor real-time progress on their personal dashboard (/dashboard).")
    add_bullet("Employer Portal: ", "Corporate recruiters will access an isolated workspace (/employer/dashboard, /employer/jobs, /employer/applications) to post new vacancies with requirements and deadlines, audit incoming applicants for their specific postings, and execute shortlisting or rejection actions.")
    add_bullet("System Administrator Module: ", "Platform administrators will possess unrestricted governance authority (/admin/jobs, /admin/applications, /dashboard), enabling them to monitor platform-wide metrics, review full applicant profile modals, and audit or delete job listings across all organizations.")

    # 9. Database Design and Supabase Architecture
    add_h1("9. Database Design and Supabase Cloud Architecture")
    add_body(
        "The relational database represents the core data foundation of the RecruitMe platform. We will utilize Supabase, an open-source Firebase alternative built on an enterprise-grade PostgreSQL relational database. Supabase provides instantaneous RESTful API generation via PostgREST, integrated JWT authentication, automated schema caching, and robust Row-Level Security (RLS) policies."
    )
    add_body(
        "The proposed database architecture has been designed around four core entities: auth.users (Supabase identity layer), jobs (catalog of job vacancies), applications (candidate job submissions), and profiles (comprehensive candidate portfolios). Figure 3 illustrates the complete Entity-Relationship diagram, specifying exact primary keys, foreign key constraints, data types, and relational cardinality."
    )
    add_diagram("diagram_er.png", "Figure 3: Supabase Relational Database Schema and Entity-Relationship Architecture")

    # 10. Detailed Database Tables and Fields
    add_h1("10. Detailed Database Tables and Field Specifications")
    add_body(
        "To ensure complete architectural clarity and eliminate ambiguity, every database table planned for the RecruitMe platform is documented below with its exact fields, data types, constraints, and functional purpose."
    )

    # Table 1: jobs
    add_h2("10.1 Table: jobs (Job Vacancies Catalog)")
    add_body(
        "The 'jobs' table will store all employment opportunities published by corporate employers and system administrators. It serves as the primary catalog queried by the public job board, the candidate application interface, and employer management dashboards."
    )
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
    create_table(jobs_headers, jobs_data, [1.1, 1.0, 1.8, 2.9])

    # Table 2: applications
    add_h2("10.2 Table: applications (Candidate Submissions)")
    add_body(
        "The 'applications' table will record every formal application submitted by a job seeker for a specific job vacancy. It establishes the critical operational link between candidates, job listings, and hiring review outcomes."
    )
    app_headers = ["Field Name", "Data Type", "Constraints", "Description & Usage"]
    app_data = [
        ["id", "UUID", "PRIMARY KEY, DEFAULT gen_random_uuid()", "Unique identifier automatically assigned to each submitted job application."],
        ["job_id", "UUID", "FOREIGN KEY -> jobs(id) ON DELETE CASCADE", "Relational reference to the target job vacancy. Deleting a job cascades to its applications."],
        ["job_title", "TEXT", "NULLABLE", "Denormalized position title recorded at time of submission for fast listing displays."],
        ["user_email", "TEXT", "NOT NULL, Logical FK -> profiles(email)", "Applicant email address, serving as a foreign key linking to the applicant's profile."],
        ["user_name", "TEXT", "NOT NULL", "Full legal name of the candidate submitting the application."],
        ["cv_name", "TEXT", "NULLABLE", "Document filename or identifier representing the candidate's uploaded resume/CV."],
        ["status", "TEXT", "DEFAULT 'Pending'", "Lifecycle state of the submission: 'Pending' (initial), 'Shortlisted', or 'Rejected'."],
        ["created_at", "TIMESTAMPTZ", "DEFAULT NOW()", "Timestamp documenting the exact moment the application was lodged."]
    ]
    create_table(app_headers, app_data, [1.1, 1.0, 1.8, 2.9])

    # Table 3: profiles
    add_h2("10.3 Table: profiles (Candidate Portfolios & Credentials)")
    add_body(
        "The 'profiles' table will maintain the comprehensive personal, contact, academic, and professional competencies of registered job seekers. It enables recruiters and administrators to inspect candidates through detailed profile modals without requiring redundant document downloads."
    )
    prof_headers = ["Field Name", "Data Type", "Constraints", "Description & Usage"]
    prof_data = [
        ["email", "TEXT", "PRIMARY KEY", "Unique email address identifying the job seeker, matching their auth credentials."],
        ["firstName", "TEXT", "NULLABLE", "Candidate legal first name."],
        ["middleName", "TEXT", "NULLABLE", "Candidate middle name (optional)."],
        ["lastName", "TEXT", "NULLABLE", "Candidate surname / last name."],
        ["fullName", "TEXT", "NULLABLE", "Combined display name utilized across navigation headers and application tables."],
        ["phone", "TEXT", "NULLABLE", "Primary telephone contact number, required by the application gatekeeper."],
        ["whatsapp", "TEXT", "NULLABLE", "Instant messaging number for direct recruiter outreach and interview scheduling."],
        ["address", "TEXT", "NULLABLE", "Physical residential address, validated prior to application submission."],
        ["city", "TEXT", "NULLABLE", "City of residence for geographic candidate filtering."],
        ["country", "TEXT", "NULLABLE", "Country of residence for domestic vs. international candidate evaluation."],
        ["aboutMe", "TEXT", "NULLABLE", "Professional biographical summary highlighting career aspirations and background."],
        ["qualification", "TEXT", "NULLABLE", "Highest academic degree attained (e.g., 'Master of Science in Data Engineering')."],
        ["experience", "TEXT", "NULLABLE", "Cumulative professional experience summary (e.g., '5+ Years in Full-Stack Dev')."],
        ["skills", "JSONB", "NULLABLE", "Flexible JSON key-value map storing technical skills and mastery percentages."],
        ["created_at", "TIMESTAMPTZ", "DEFAULT NOW()", "Timestamp recording initial candidate profile registration."]
    ]
    create_table(prof_headers, prof_data, [1.1, 1.0, 1.8, 2.9])

    # Table 4: auth.users
    add_h2("10.4 Table: auth.users (Supabase Identity & Authentication)")
    add_body(
        "The 'auth.users' table is managed internally by Supabase Auth to guarantee cryptographic security, session tokens, and password protection. It will store user credentials and critical role metadata:"
    )
    auth_headers = ["Field Name", "Data Type", "Constraints", "Description & Usage"]
    auth_data = [
        ["id", "UUID", "PRIMARY KEY", "Unique cryptographic subject identifier (UUID) assigned to each registered user."],
        ["email", "TEXT", "UNIQUE, NOT NULL", "User login email address, normalized to lowercase to prevent duplicate accounts."],
        ["encrypted_password", "TEXT", "NOT NULL", "Cryptographic one-way hash (bcrypt salted) storing user password securely."],
        ["raw_user_meta_data", "JSONB", "NULLABLE", "Structured JSON object storing custom attributes: fullName, role, companyName."],
        ["created_at", "TIMESTAMPTZ", "DEFAULT NOW()", "Timestamp recording account creation and verification status."]
    ]
    create_table(auth_headers, auth_data, [1.2, 1.0, 1.7, 2.9])

    # 11. Data Operations & Lifecycle Management
    add_h1("11. Data Operations, Relational Integrity, and Security")
    add_body(
        "The proposed system will implement disciplined CRUD (Create, Read, Update, Delete) data operations and security controls across all entities:"
    )
    add_bullet("Job Management Lifecycle: ", "Employers and administrators will insert new postings via the Post Job interface, automatically associating the user's UUID into employer_id. DataContext will dispatch SQL queries via Supabase PostgREST client: supabase.from('jobs').insert([payload]). Deleting a job executes a cascaded deletion of all associated candidate applications (ON DELETE CASCADE), preventing orphaned database records.")
    add_bullet("Application Submission & State Transitions: ", "When a candidate applies, the system verifies that the job's lastDate has not passed and that the applicant's profile possesses valid phone and address values. Upon passing validation, an application record is inserted with status defaulting to 'Pending'. Employers and administrators can update the status column to 'Shortlisted' or 'Rejected' via supabase.from('applications').update({ status }).eq('id', appId), which immediately updates applicant dashboard cards.")
    add_bullet("Profile Upsert & JSONB Mastery Storage: ", "Profile updates will utilize PostgreSQL UPSERT mechanics (supabase.from('profiles').upsert([payload], { onConflict: 'email' })). The skills column leverages native PostgreSQL JSONB formatting (e.g., {'Programming': 70, 'UI Design': 85}), allowing candidates to update and add arbitrary competencies without requiring schema alterations.")
    add_bullet("Row-Level Security (RLS) & Indices: ", "To guarantee rapid query execution, an index will be deployed on the foreign key column (CREATE INDEX idx_jobs_employer_id ON jobs(employer_id)). Row-Level Security (RLS) will be activated across all tables to enforce access boundaries.")

    # 12. Technologies and Tools
    add_h1("12. Technologies and Development Stack")
    add_body(
        "The proposed system will be built using modern, production-grade tools and frameworks selected for high performance, developer productivity, and scalability:"
    )
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
    create_table(tech_headers, tech_data, [1.3, 1.2, 0.9, 3.4])

    # 13. Expected Outcomes
    add_h1("13. Expected Outcomes and Deliverables")
    add_body(
        "Upon successful execution and development, the proposed RecruitMe project will deliver the following concrete outcomes:"
    )
    add_bullet("1. Enterprise-Grade Web Platform: ", "A fully responsive, multi-role online recruitment portal accessible across desktop, tablet, and mobile browsers.")
    add_bullet("2. Dedicated Workspace Isolation: ", "Three isolated, role-tailored portals guaranteeing that Job Seekers, Corporate Employers, and System Administrators perform their designated tasks without interface overlap.")
    add_bullet("3. Transparent Hiring Pipeline: ", "An automated, transparent application tracking system that eliminates the 'resume black hole' by providing real-time status feedback.")
    add_bullet("4. Scalable Cloud Database Architecture: ", "A fully documented, ACID-compliant Supabase PostgreSQL database schema complete with relational constraints, indexed foreign keys, and RLS policies.")
    add_bullet("5. Automated Hiring Governance: ", "An administrative command center capable of monitoring hiring velocity, tracking open vacancies, and governing platform-wide content.")

    # 14. Conclusion
    add_h1("14. Conclusion")
    add_body(
        "The proposed RecruitMe Online Recruitment System represents an innovative, cloud-native response to the inefficiencies, opacity, and fragmentation currently plaguing talent acquisition workflows. By combining Next.js 16, React 19, and Supabase PostgreSQL into a coherent multi-tier architecture, the proposed system will bridge the communication gap between ambitious job seekers, dynamic employers, and administrative overseers. The granular role separation, automated application gatekeepers, dynamic skill matrices, and transparent status lifecycles will establish an accessible, reliable, and scalable recruitment ecosystem. This project demonstrates significant academic rigor and practical utility, establishing a solid engineering foundation for contemporary cloud software development and modern human resource technologies."
    )

    doc.save(output_path)
    print(f"Proposal written successfully to: {output_path}")

if __name__ == "__main__":
    build_docx("RecruitMe_Project_Proposal.docx")

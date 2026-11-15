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

def add_page_number_fields(run):
    fldSimple1 = OxmlElement('w:fldSimple')
    fldSimple1.set(qn('w:instr'), 'PAGE')
    run._r.append(fldSimple1)

def add_total_pages_field(run):
    fldSimple2 = OxmlElement('w:fldSimple')
    fldSimple2.set(qn('w:instr'), 'NUMPAGES')
    run._r.append(fldSimple2)

def generate_doc(output_path):
    doc = docx.Document()

    for section in doc.sections:
        section.top_margin = Inches(0.45)
        section.bottom_margin = Inches(0.45)
        section.left_margin = Inches(0.60)
        section.right_margin = Inches(0.60)

        # Header
        header = section.header
        header_p = header.paragraphs[0]
        header_p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        h_run = header_p.add_run("RecruitMe: Online Recruitment System  |  Project Proposal")
        h_run.font.name = "Calibri"
        h_run.font.size = Pt(8.0)
        h_run.font.color.rgb = RGBColor(100, 116, 139)

        # Footer
        footer = section.footer
        footer_p = footer.paragraphs[0]
        footer_p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        f_run1 = footer_p.add_run("Academic Final Year Project Proposal  —  Confidential")
        f_run1.font.name = "Calibri"
        f_run1.font.size = Pt(8.0)
        f_run1.font.color.rgb = RGBColor(148, 163, 184)
        
        f_spacer = footer_p.add_run("\t\tPage ")
        f_spacer.font.name = "Calibri"
        f_spacer.font.size = Pt(8.0)
        f_spacer.font.color.rgb = RGBColor(100, 116, 139)
        add_page_number_fields(footer_p.add_run())
        f_mid = footer_p.add_run(" of ")
        f_mid.font.name = "Calibri"
        f_mid.font.size = Pt(8.0)
        f_mid.font.color.rgb = RGBColor(100, 116, 139)
        add_total_pages_field(footer_p.add_run())

    NAVY = RGBColor(15, 23, 42)
    SLATE = RGBColor(51, 65, 85)
    MUTED = RGBColor(100, 116, 139)
    EMERALD = RGBColor(5, 150, 105)
    body_font_pt = 8.2
    line_spacing = 1.02

    def add_title(text):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(1)
        run = p.add_run(text)
        run.font.name = "Calibri"
        run.font.size = Pt(15.5)
        run.font.bold = True
        run.font.color.rgb = NAVY
        return p

    def add_subtitle(text):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(4)
        run = p.add_run(text)
        run.font.name = "Calibri"
        run.font.size = Pt(9.0)
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
            set_cell_margins(cell, top=20, bottom=20, left=40, right=40)
            cp = cell.paragraphs[0]
            cp.alignment = WD_ALIGN_PARAGRAPH.LEFT
            cp.paragraph_format.space_after = Pt(0)
            
            r_lbl = cp.add_run(label + "\n")
            r_lbl.font.name = "Calibri"
            r_lbl.font.size = Pt(6.5)
            r_lbl.font.bold = True
            r_lbl.font.color.rgb = MUTED
            
            r_val = cp.add_run(val)
            r_val.font.name = "Calibri"
            r_val.font.size = Pt(7.5)
            r_val.font.bold = True
            r_val.font.color.rgb = NAVY
        doc.add_paragraph().paragraph_format.space_after = Pt(1)

    def add_h1(text, space_before=3.0, space_after=1.0):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(space_before)
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = "Calibri"
        run.font.size = Pt(9.5)
        run.font.bold = True
        run.font.color.rgb = NAVY
        return p

    def add_body(text, bold_prefix=None, space_after=1.2):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.line_spacing = line_spacing
        if bold_prefix:
            br = p.add_run(bold_prefix)
            br.font.name = "Calibri"
            br.font.size = Pt(body_font_pt)
            br.font.bold = True
            br.font.color.rgb = NAVY
        run = p.add_run(text)
        run.font.name = "Calibri"
        run.font.size = Pt(body_font_pt)
        run.font.color.rgb = SLATE
        return p

    def add_bullet(bold_prefix, text, space_after=1.0):
        p = doc.add_paragraph(style='List Bullet')
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.line_spacing = line_spacing
        if bold_prefix:
            br = p.add_run(bold_prefix)
            br.font.name = "Calibri"
            br.font.size = Pt(body_font_pt)
            br.font.bold = True
            br.font.color.rgb = NAVY
        run = p.add_run(text)
        run.font.name = "Calibri"
        run.font.size = Pt(body_font_pt)
        run.font.color.rgb = SLATE
        return p

    def add_diagram(img_path, caption_text, width_in=5.4, space_before=1.5, space_after=1.5):
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
            c_run.font.size = Pt(6.8)
            c_run.font.italic = True
            c_run.font.color.rgb = MUTED

    def create_table(headers, data, col_widths=None, space_after=1.2):
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
            set_cell_margins(cell, top=16, bottom=16, left=35, right=35)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            p.paragraph_format.space_after = Pt(0)
            run = p.add_run(h_text)
            run.font.name = "Calibri"
            run.font.size = Pt(6.6)
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
                set_cell_margins(cell, top=12, bottom=12, left=35, right=35)
                p = cell.paragraphs[0]
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                p.paragraph_format.space_after = Pt(0)
                p.paragraph_format.line_spacing = 0.96
                run = p.add_run(str(val))
                run.font.name = "Calibri"
                run.font.size = Pt(6.6)
                run.font.color.rgb = SLATE
                if c_idx in [0, 1]:
                    run.font.bold = True
                    run.font.color.rgb = NAVY

        doc.add_paragraph().paragraph_format.space_after = Pt(space_after)

    # -------------------------------------------------------------
    # DOCUMENT CONTENT
    # -------------------------------------------------------------

    add_title("PROJECT PROPOSAL: RECRUITME")
    add_subtitle("An Intelligent, Multi-Role Online Recruitment & Talent Acquisition Platform")

    metadata = [
        ("PROJECT DOMAIN", "Cloud Software Engineering & Database Systems"),
        ("TARGET STAKEHOLDERS", "Job Seekers, Corporate Employers, System Admins"),
        ("DATABASE PLATFORM", "Supabase PostgreSQL (BaaS with RLS Engine)"),
        ("FRONTEND FRAMEWORK", "Next.js 16 (App Router), React 19, Tailwind CSS"),
    ]
    add_metadata_box(metadata)

    # 1. Introduction
    add_h1("1. Introduction and Background", space_before=1.0)
    add_body(
        "Modern human resource management has transitioned rapidly toward digital platforms to accelerate hiring workflows, broaden talent reach, and establish structured evaluation standards. Despite the widespread availability of commercial job boards, contemporary recruitment operations continue to suffer from fragmented application tracking, inadequate candidate portfolio management, and an absence of dedicated multi-stakeholder workspace isolation. Small-to-medium enterprises often find enterprise ERP platforms cost-prohibitive, while lightweight classified job boards lack rigorous application lifecycle controls and profile analytics."
    )
    add_body(
        "To resolve these challenges, this project proposes the design and full-stack development of RecruitMe—an intelligent, cloud-native Online Recruitment System. The proposed platform will provide a unified digital ecosystem serving three distinct user archetypes: Job Seekers seeking transparent career progression, Employers requiring targeted vacancy distribution and applicant evaluation tools, and System Administrators requiring centralized oversight over platform governance, security compliance, and recruitment velocity metrics."
    )

    # 2. Problem Statement
    add_h1("2. Problem Statement")
    add_body(
        "Conventional recruitment channels and legacy job listing portals exhibit critical structural bottlenecks that impair organizational productivity and candidate engagement:"
    )
    add_bullet("Fragmented Screening Workflows: ", "Recruiters are inundated with unstructured resumes transmitted via generic email threads, resulting in administrative latency and severe delays in candidate review.")
    add_bullet("Lack of Candidate Status Transparency: ", "Applicants frequently experience the 'resume black hole,' where no programmatic feedback is provided regarding whether an application is pending, shortlisted, or rejected.")
    add_bullet("Absence of Multi-Role Workspace Isolation: ", "Most lightweight web portals fail to implement granular, role-based interfaces, forcing employers to navigate cluttered layouts without dedicated hiring pipelines.")
    add_bullet("Unenforced Deadlines and Static Portfolios: ", "Job postings frequently remain open indefinitely without automated deadline enforcement, while applicant profiles are limited to static text fields rather than measurable, multidimensional skill matrices.")

    # 3. Aim and Objectives
    add_h1("3. Aim of the Project and Objectives")
    add_body(
        "The primary aim of this project is to propose, design, and develop a high-performance, responsive, and secure multi-role web-based recruitment platform that standardizes the complete talent acquisition lifecycle—spanning dynamic vacancy publication, profile-driven candidate submissions, intelligent competency evaluation, real-time application tracking, and administrative governance. To accomplish this aim, we will pursue the following specific objectives:"
    )
    add_bullet("1. Cloud Database & Backend Infrastructure: ", "We will construct a fully relational database schema on Supabase PostgreSQL, leveraging Row-Level Security (RLS) policies and automated PostgREST APIs for real-time data persistence.")
    add_bullet("2. Secure Role-Based Authentication: ", "We will implement an enterprise-grade authentication mechanism supporting Job Seeker, Employer, and Administrator personas with strict route protection, JWT token validation, and metadata role persistence.")
    add_bullet("3. Dynamic Candidate Portfolio Studio: ", "We will engineer an interactive profile studio enabling job seekers to curate detailed professional identities, including contact metadata, educational history, work experience, and percentage-based technical skills ratings.")
    add_bullet("4. Employer Vacancy Management Studio: ", "We will build a self-service employer portal allowing verified organizations to post structured vacancies with qualification prerequisites, vacancy counts, and strict deadline enforcement.")
    add_bullet("5. Transparent Application Lifecycle Tracking: ", "We will develop a bidirectional tracking pipeline enabling employers and admins to transition candidate statuses (Pending, Shortlisted, Rejected) with immediate visual feedback across applicant dashboards.")
    add_bullet("6. Administrative Governance & Analytics Command Center: ", "We will implement an administrative executive dashboard featuring global platform aggregates, real-time vacancy balancing, applicant review modals, and system-wide content moderation.")

    # 4. Proposed Solution & Architecture
    add_h1("4. Proposed Solution and System Architecture")
    add_body(
        "The proposed RecruitMe platform will be architected as a modular, cloud-native web application utilizing Next.js 16 with the React Server Component (RSC) paradigm, paired with Supabase as a Backend-as-a-Service (BaaS). The system will maintain a strict three-tier architecture comprising Presentation, Business Logic & Context State, and Cloud Data Storage. Figure 1 illustrates the high-level system architecture and multi-role operational workflow."
    )
    add_diagram("fig1_architecture_workflow.png", "Figure 1: High-Level System Architecture and Multi-Role Workflow Pipeline of the Proposed Platform", width_in=5.4)

    # 5. Features & Functionalities
    add_h1("5. System Features and Functional Capabilities")
    add_body(
        "The proposed platform will incorporate an extensive array of user-facing and back-office functionalities categorized into distinct functional modules:"
    )
    add_bullet("Dynamic Public Discovery Portal: ", "An engaging landing page featuring platform statistics, partner brand showcases, 'How It Works' process breakdowns, category exploration badges, and an email newsletter subscription mechanism.")
    add_bullet("Real-Time Search & Filtering Engine: ", "The /jobs catalog will enable instant keyword searching across position titles and role descriptions, with color-coded category tags and real-time empty-state handling.")
    add_bullet("Automated Application Gatekeeper: ", "The system will automatically compare current server timestamps against job submission deadlines (lastDate). Expired listings will be marked as 'Closed' and dynamically disable application submission controls.")
    add_bullet("Pre-Application Profile Validation: ", "Prior to permitting candidate submissions, the platform will verify that the applicant's profile contains essential contact information (phone number, physical address), preventing incomplete submissions.")
    add_bullet("Interactive Candidate Skill Progress Bars: ", "Applicant profiles will render visual competency meters displaying percentage mastery across diverse technical domains, persisted dynamically in JSONB.")
    add_bullet("Employer Applicant Management Studio: ", "Employers will access dedicated applicant management tables featuring multi-parameter filters (by specific job posting, candidate status, or applicant keyword) with one-click status transitions.")

    # 6. Intelligent Components
    add_h1("6. Intelligent Evaluation and Matching Components")
    add_body(
        "The proposed platform will integrate intelligent algorithmic mechanisms designed to automate candidate screening and streamline recruitment analytics:"
    )
    add_bullet("Dynamic Competency & Skill Mastery Modeling: ", "Rather than treating candidate qualifications as static text, the system will utilize a flexible JSONB skill evaluation matrix. Candidates will define percentage mastery scores across core technical skills (e.g., Programming, UI Design, Research), which the system will normalize to generate comparative candidate proficiency profiles.")
    add_bullet("Automated Eligibility & Completeness Gatekeeping: ", "The application engine will employ client-side and database-level validation logic to ensure that only eligible, fully documented candidates can submit applications. Submissions without requisite contact details or targeting closed vacancies will be rejected programmatically at the interface boundary.")
    add_bullet("Real-Time Vacancy Balancing Algorithm: ", "The admin and employer modules will feature dynamic vacancy calculation algorithms. As candidates are transitioned to 'Shortlisted' status, the platform will automatically recalculate remaining open positions against the authorized vacancy ceiling (Remaining = Total Vacancies - Shortlisted Candidates), maintaining operational hiring accuracy.")
    add_bullet("Predictive Hiring Analytics Visualizer: ", "The administrative command center will incorporate multi-month hiring velocity charts and skill distribution analytics, providing hiring leads with immediate visual telemetry regarding recruitment trends.")

    # 7. User & Admin Modules
    add_h1("7. User, Employer, and Admin Modules")
    add_body("The proposed system enforces strict workspace separation across three designated user personas:")
    add_bullet("Job Seeker Module: ", "Candidates will register personal accounts, maintain an extensive digital resume (/profile), browse active postings, upload document CV references, and monitor real-time progress on their personal dashboard (/dashboard).")
    add_bullet("Employer Portal: ", "Corporate recruiters will access an isolated workspace (/employer/dashboard, /employer/jobs, /employer/applications) to post new vacancies with requirements and deadlines, audit incoming applicants for their specific postings, and execute shortlisting or rejection actions.")
    add_bullet("System Administrator Module: ", "Platform administrators will possess unrestricted governance authority (/admin/jobs, /admin/applications, /dashboard), enabling them to monitor platform-wide metrics, review full applicant profile modals, and audit or delete job listings across all organizations.")

    # 8. Technologies Table
    add_h1("8. Technologies and Development Tools")
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
    create_table(tech_headers, tech_data, [1.1, 1.1, 0.9, 4.0], space_after=1.2)

    # 9. Database Design & Supabase Architecture
    add_h1("9. Database Design and Supabase Cloud Architecture")
    add_body(
        "The relational database represents the core data foundation of the RecruitMe platform. We will utilize Supabase, an enterprise-grade Backend-as-a-Service built on a PostgreSQL relational engine. Supabase provides instantaneous RESTful API generation via PostgREST, integrated JWT authentication, automated schema caching, and robust Row-Level Security (RLS) policies. Figure 2 illustrates the complete Entity-Relationship diagram, specifying exact primary keys, foreign key constraints, data types, and relational cardinality."
    )
    add_diagram("fig2_database_er.png", "Figure 2: Supabase Relational Database Schema and Entity-Relationship Architecture", width_in=5.4)

    # 10. Detailed Database Tables
    add_h1("10. Detailed Database Tables, Columns, and Schemas")
    add_body(
        "To ensure complete architectural clarity, every database table planned for the RecruitMe platform is documented below with its exact fields, data types, constraints, and functional purpose based directly on the project's SQL schema:"
    )

    db_headers = ["Table Name", "Field Name", "Data Type & Key", "Functional Description & Usage in Platform"]
    db_data = [
        # jobs
        ["jobs", "id", "UUID (PK, DEFAULT gen_random_uuid())", "Unique 128-bit identifier generated automatically for each job posting."],
        ["jobs", "title", "TEXT (NOT NULL)", "Official job position title (e.g., 'Senior Frontend Engineer', 'UI/UX Lead')."],
        ["jobs", "description", "TEXT (NOT NULL)", "Comprehensive description of job responsibilities, requirements, and benefits."],
        ["jobs", "qualification", "TEXT (NULLABLE)", "Academic qualification or certifications required (e.g., 'BS in Computer Science')."],
        ["jobs", "ageLimit", "TEXT (NULLABLE)", "Prescribed candidate age restrictions for the position (e.g., '21-35 Years')."],
        ["jobs", "lastDate", "TEXT (NULLABLE, ISO)", "Application closing deadline formatted as ISO date string for automated expiration checks."],
        ["jobs", "vacancies", "INTEGER (DEFAULT 1)", "Total number of open positions authorized for hiring under this listing."],
        ["jobs", "category", "TEXT (NULLABLE)", "Professional job classification domain (e.g., 'Engineering', 'Design', 'Marketing')."],
        ["jobs", "color", "TEXT (NULLABLE)", "Visual theme identifier applied to category badges and job card styling on the frontend."],
        ["jobs", "employer_id", "UUID (FK -> auth.users.id)", "Links the job listing to the authenticated employer account that created the posting."],
        ["jobs", "employer_name", "TEXT (DEFAULT '')", "Denormalized organization or company name for high-speed query rendering."],
        ["jobs", "created_at", "TIMESTAMPTZ (DEFAULT NOW())", "Automated timestamp recording when the job posting was published."],

        # applications
        ["applications", "id", "UUID (PK, DEFAULT gen_random_uuid())", "Unique identifier automatically assigned to each submitted job application."],
        ["applications", "job_id", "UUID (FK -> jobs.id, CASCADE)", "Relational reference to target job vacancy. Deleting a job cascades to its applications."],
        ["applications", "job_title", "TEXT (NULLABLE)", "Denormalized position title recorded at time of submission for fast listing displays."],
        ["applications", "user_email", "TEXT (NOT NULL, Logical FK)", "Applicant email address, serving as a foreign key linking to the applicant's profile."],
        ["applications", "user_name", "TEXT (NOT NULL)", "Full legal name of the candidate submitting the application."],
        ["applications", "cv_name", "TEXT (NULLABLE)", "Document filename or identifier representing the candidate's uploaded resume/CV."],
        ["applications", "status", "TEXT (DEFAULT 'Pending')", "Lifecycle state of the submission: 'Pending' (initial), 'Shortlisted', or 'Rejected'."],
        ["applications", "created_at", "TIMESTAMPTZ (DEFAULT NOW())", "Timestamp documenting the exact moment the application was lodged."],

        # profiles
        ["profiles", "email", "TEXT (PRIMARY KEY)", "Unique email address identifying the job seeker, matching their auth credentials."],
        ["profiles", "fullName / names", "TEXT (NULLABLE)", "Legal first, middle, last, and combined display name for applicant tables."],
        ["profiles", "phone", "TEXT (NULLABLE)", "Primary telephone contact number, required by the application gatekeeper."],
        ["profiles", "whatsapp", "TEXT (NULLABLE)", "Instant messaging number for direct recruiter outreach and interview scheduling."],
        ["profiles", "address / city", "TEXT (NULLABLE)", "Physical residential address and location metadata, validated before applying."],
        ["profiles", "aboutMe / qual", "TEXT (NULLABLE)", "Professional biographical summary and highest academic degree attained."],
        ["profiles", "experience", "TEXT (NULLABLE)", "Cumulative professional experience summary (e.g., '5+ Years in Full-Stack Dev')."],
        ["profiles", "skills", "JSONB (NULLABLE)", "Flexible JSON key-value map storing technical skills and mastery percentages."],
        ["profiles", "created_at", "TIMESTAMPTZ (DEFAULT NOW())", "Timestamp recording initial candidate profile registration."],

        # auth.users
        ["auth.users", "id", "UUID (PRIMARY KEY)", "Unique cryptographic subject identifier (UUID) assigned to each registered user."],
        ["auth.users", "email", "TEXT (UNIQUE, NOT NULL)", "User login email address, normalized to lowercase to prevent duplicate accounts."],
        ["auth.users", "encrypted_pw", "TEXT (NOT NULL)", "Cryptographic one-way hash (bcrypt salted) storing user password securely."],
        ["auth.users", "metadata", "JSONB (NULLABLE)", "Structured JSON object storing custom attributes: fullName, role, companyName."],
        ["auth.users", "created_at", "TIMESTAMPTZ (DEFAULT NOW())", "Timestamp recording account creation and verification status."]
    ]
    create_table(db_headers, db_data, [0.8, 1.0, 1.6, 3.7], space_after=1.2)

    # 11. Data Operations & Security
    add_h1("11. Database Operations, Lifecycle Management, and Security")
    add_body(
        "The proposed system will implement disciplined CRUD (Create, Read, Update, Delete) data operations and security controls across all entities:"
    )
    add_bullet("Job Management Lifecycle: ", "Employers and administrators will insert new postings via the Post Job interface, automatically associating the user's UUID into employer_id. DataContext will dispatch SQL queries via Supabase PostgREST client: supabase.from('jobs').insert([payload]). Deleting a job executes a cascaded deletion of all associated candidate applications (ON DELETE CASCADE), preventing orphaned database records.")
    add_bullet("Application Submission & State Transitions: ", "When a candidate applies, the system verifies that the job's lastDate has not passed and that the applicant's profile possesses valid phone and address values. Upon passing validation, an application record is inserted with status defaulting to 'Pending'. Employers and administrators can update the status column to 'Shortlisted' or 'Rejected' via supabase.from('applications').update({ status }).eq('id', appId), which immediately updates applicant dashboard cards.")
    add_bullet("Profile Upsert & JSONB Mastery Storage: ", "Profile updates will utilize PostgreSQL UPSERT mechanics (supabase.from('profiles').upsert([payload], { onConflict: 'email' })). The skills column leverages native PostgreSQL JSONB formatting (e.g., {'Programming': 70, 'UI Design': 85}), allowing candidates to update and add arbitrary competencies without requiring schema alterations.")
    add_bullet("Row-Level Security (RLS) & Indices: ", "To guarantee rapid query execution, an index will be deployed on the foreign key column (CREATE INDEX idx_jobs_employer_id ON jobs(employer_id)). Row-Level Security (RLS) will be activated across all tables to enforce access boundaries.")

    # 12. Relational Integrity
    add_h1("12. Relational Integrity and Business Rules")
    add_body("The proposed system enforces critical relational rules to guarantee system reliability and consistent business logic:")
    add_bullet("Multi-Tenant Role Isolation (1 : N): ", "auth.users securely manages identity and assigns roles ('user', 'employer', 'admin'). Employers are tied to their postings via employer_id, ensuring strict workspace isolation.")
    add_bullet("Cascading Job Deletions (1 : N): ", "jobs.id is referenced by applications.job_id with ON DELETE CASCADE constraint. Removing a job cleanly removes candidate applications without leaving broken relational links.")
    add_bullet("Profile-Application Association (1 : N): ", "applications.user_email references profiles.email. Applications require a completed profile (phone & address) before submission, ensuring recruiters always receive actionable contact data.")
    add_bullet("Application Lifecycle Pipeline: ", "Every application defaults to 'Pending'. Employers and Administrators update status to 'Shortlisted' or 'Rejected', updating live applicant dashboards and recalculating open vacancy tallies.")

    # 13. Expected Outcomes
    add_h1("13. Expected Outcomes and Deliverables")
    add_body("Upon successful execution and development, the proposed RecruitMe project will deliver the following concrete outcomes:")
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
    print(f"Generated doc at: {output_path}")

if __name__ == "__main__":
    generate_doc("RecruitMe_Project_Proposal.docx")

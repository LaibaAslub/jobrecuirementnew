import os
from PIL import Image, ImageDraw, ImageFont

def get_font(size, bold=False):
    try:
        font_name = "arialbd.ttf" if bold else "arial.ttf"
        return ImageFont.truetype(font_name, size)
    except Exception:
        try:
            return ImageFont.truetype("arial.ttf", size)
        except Exception:
            return ImageFont.load_default()

def draw_rounded_rect(draw, bbox, radius, fill, outline=None, width=1):
    x0, y0, x1, y1 = bbox
    draw.rounded_rectangle([x0, y0, x1, y1], radius=radius, fill=fill, outline=outline, width=width)

def create_architecture_diagram(filename):
    w, h = 1600, 780
    img = Image.new("RGB", (w, h), "#F8FAFC")
    draw = ImageDraw.Draw(img)

    # Title Banner
    draw_rounded_rect(draw, (40, 25, w - 40, 95), 16, "#0F172A")
    title_font = get_font(28, bold=True)
    sub_font = get_font(16, bold=False)
    draw.text((w/2, 48), "RecruitMe: Proposed High-Level System Architecture", fill="#FFFFFF", font=title_font, anchor="mm")
    draw.text((w/2, 76), "Client-Side Presentation, Application State/Security Logic, and Supabase Cloud Infrastructure", fill="#94A3B8", font=sub_font, anchor="mm")

    # Layer 1: Client / Presentation Tier
    draw_rounded_rect(draw, (40, 120, 500, 720), 20, "#FFFFFF", outline="#CBD5E1", width=2)
    draw_rounded_rect(draw, (55, 135, 485, 185), 12, "#0F172A")
    draw.text((270, 160), "1. Presentation Layer (Client UI)", fill="#FFFFFF", font=get_font(18, bold=True), anchor="mm")

    # Boxes inside Layer 1
    ui_boxes = [
        ("Next.js 16 App Router", "Server & Client Components, Dynamic Routing (/jobs, /apply/[id], /employer, /admin)", "#EEF2FF", "#4F46E5"),
        ("React 19 Interactive Views", "Public Portal, Seeker Dashboard, Employer Studio, Admin Command Center", "#F0FDF4", "#16A34A"),
        ("Modern Design System", "Tailwind CSS Engine, Responsive Layouts, Glassmorphic Headers, Micro-Animations", "#F8FAFC", "#475569"),
        ("Iconography & Visuals", "Lucide React System Icons, Category Color Accents, Visual Status Badges", "#FFFBEB", "#D97706"),
    ]
    y_cursor = 205
    for title, desc, bg, border in ui_boxes:
        draw_rounded_rect(draw, (60, y_cursor, 480, y_cursor + 110), 12, bg, outline=border, width=2)
        draw.text((75, y_cursor + 25), title, fill="#0F172A", font=get_font(16, bold=True))
        # Word wrap desc
        words = desc.split(" ")
        lines = []
        cur = ""
        for word in words:
            if len(cur + " " + word) < 46:
                cur = cur + " " + word if cur else word
            else:
                lines.append(cur)
                cur = word
        if cur:
            lines.append(cur)
        for idx, line in enumerate(lines[:3]):
            draw.text((75, y_cursor + 52 + idx * 20), line, fill="#475569", font=get_font(13))
        y_cursor += 125

    # Layer 2: Application Logic & Context Tier
    draw_rounded_rect(draw, (540, 120, 1020, 720), 20, "#FFFFFF", outline="#CBD5E1", width=2)
    draw_rounded_rect(draw, (555, 135, 1005, 185), 12, "#1E293B")
    draw.text((780, 160), "2. Context & Business Logic Layer", fill="#FFFFFF", font=get_font(18, bold=True), anchor="mm")

    logic_boxes = [
        ("AuthContext (RBAC Service)", "Session persistence, token lifecycle, role verification (Seeker vs Employer vs Admin)", "#F0FDF4", "#059669"),
        ("DataContext (Data Synchronization)", "Reactive state management, real-time caching, optimistic updates, query dispatcher", "#EFF6FF", "#2563EB"),
        ("Validation & Gatekeeper Logic", "Deadline enforcement (automatic job expiration), profile completeness verification", "#FEF2F2", "#DC2626"),
        ("Intelligent Candidate Analytics", "Skills rating calculation, recruitment metrics aggregation, vacancies tracking", "#FAF5FF", "#7C3AED"),
    ]
    y_cursor = 205
    for title, desc, bg, border in logic_boxes:
        draw_rounded_rect(draw, (560, y_cursor, 1000, y_cursor + 110), 12, bg, outline=border, width=2)
        draw.text((575, y_cursor + 25), title, fill="#0F172A", font=get_font(16, bold=True))
        words = desc.split(" ")
        lines = []
        cur = ""
        for word in words:
            if len(cur + " " + word) < 44:
                cur = cur + " " + word if cur else word
            else:
                lines.append(cur)
                cur = word
        if cur:
            lines.append(cur)
        for idx, line in enumerate(lines[:3]):
            draw.text((575, y_cursor + 52 + idx * 20), line, fill="#475569", font=get_font(13))
        y_cursor += 125

    # Layer 3: Supabase Cloud Backend & Database Tier
    draw_rounded_rect(draw, (1060, 120, 1560, 720), 20, "#FFFFFF", outline="#CBD5E1", width=2)
    draw_rounded_rect(draw, (1075, 135, 1545, 185), 12, "#047857")
    draw.text((1310, 160), "3. Supabase Cloud BaaS Tier", fill="#FFFFFF", font=get_font(18, bold=True), anchor="mm")

    backend_boxes = [
        ("Supabase Auth & Identity", "Managed user authentication, bcrypt salted passwords, JWT issuance, metadata store", "#ECFDF5", "#059669"),
        ("PostgREST Dynamic API Engine", "Instant RESTful API generation from PostgreSQL schema, automated JSON serialization", "#EFF6FF", "#3B82F6"),
        ("PostgreSQL Relational Database", "ACID compliant schemas: 'jobs', 'applications', 'profiles', indexed keys & cascade rules", "#F8FAFC", "#0F172A"),
        ("Row Level Security (RLS) & Policies", "Fine-grained database policies enforcing multi-tenant isolation and role authorization", "#FFFBEB", "#D97706"),
    ]
    y_cursor = 205
    for title, desc, bg, border in backend_boxes:
        draw_rounded_rect(draw, (1080, y_cursor, 1540, y_cursor + 110), 12, bg, outline=border, width=2)
        draw.text((1095, y_cursor + 25), title, fill="#0F172A", font=get_font(16, bold=True))
        words = desc.split(" ")
        lines = []
        cur = ""
        for word in words:
            if len(cur + " " + word) < 44:
                cur = cur + " " + word if cur else word
            else:
                lines.append(cur)
                cur = word
        if cur:
            lines.append(cur)
        for idx, line in enumerate(lines[:3]):
            draw.text((1095, y_cursor + 52 + idx * 20), line, fill="#475569", font=get_font(13))
        y_cursor += 125

    # Connecting Arrows
    arrow_font = get_font(12, bold=True)
    # Between Layer 1 and Layer 2
    draw.polygon([(505, 300), (535, 300), (525, 292)], fill="#64748B")
    draw.polygon([(535, 308), (505, 308), (515, 316)], fill="#64748B")
    draw.text((520, 275), "State Props", fill="#64748B", font=arrow_font, anchor="mm")

    draw.polygon([(505, 540), (535, 540), (525, 532)], fill="#64748B")
    draw.polygon([(535, 548), (505, 548), (515, 556)], fill="#64748B")
    draw.text((520, 515), "Actions", fill="#64748B", font=arrow_font, anchor="mm")

    # Between Layer 2 and Layer 3
    draw.polygon([(1025, 300), (1055, 300), (1045, 292)], fill="#64748B")
    draw.polygon([(1055, 308), (1025, 308), (1035, 316)], fill="#64748B")
    draw.text((1040, 275), "HTTPS/REST", fill="#64748B", font=arrow_font, anchor="mm")

    draw.polygon([(1025, 540), (1055, 540), (1045, 532)], fill="#64748B")
    draw.polygon([(1055, 548), (1025, 548), (1035, 556)], fill="#64748B")
    draw.text((1040, 515), "RLS Tokens", fill="#64748B", font=arrow_font, anchor="mm")

    # Save
    img.save(filename, "PNG", dpi=(300, 300))
    print(f"Saved: {filename}")

def create_er_diagram(filename):
    w, h = 1600, 880
    img = Image.new("RGB", (w, h), "#F8FAFC")
    draw = ImageDraw.Draw(img)

    # Title
    draw_rounded_rect(draw, (40, 20, w - 40, 85), 14, "#0F172A")
    draw.text((w/2, 42), "Supabase Relational Database Schema & Entity Relationships", fill="#FFFFFF", font=get_font(26, bold=True), anchor="mm")
    draw.text((w/2, 68), "Exact Table Definitions, Primary Keys, Foreign Key Constraints, and Multi-Role Data Associations", fill="#94A3B8", font=get_font(15), anchor="mm")

    def draw_table_card(x, y, w_box, h_box, header_title, header_bg, columns):
        # Card container
        draw_rounded_rect(draw, (x, y, x + w_box, y + h_box), 16, "#FFFFFF", outline="#CBD5E1", width=2)
        # Header
        draw_rounded_rect(draw, (x, y, x + w_box, y + 45), 14, header_bg)
        draw.text((x + 18, y + 22), header_title, fill="#FFFFFF", font=get_font(17, bold=True), anchor="lm")

        # Column list
        row_y = y + 55
        for col_name, col_type, is_key in columns:
            badge_color = "#4F46E5" if "PK" in is_key else ("#059669" if "FK" in is_key else "#64748B")
            draw.text((x + 18, row_y + 12), col_name, fill="#0F172A", font=get_font(13, bold=("PK" in is_key or "FK" in is_key)), anchor="lm")
            draw.text((x + w_box - 130, row_y + 12), col_type, fill="#64748B", font=get_font(12), anchor="lm")
            if is_key:
                draw_rounded_rect(draw, (x + w_box - 55, row_y + 2, x + w_box - 15, row_y + 22), 6, badge_color)
                draw.text((x + w_box - 35, row_y + 12), is_key, fill="#FFFFFF", font=get_font(10, bold=True), anchor="mm")
            # Separator
            draw.line([(x + 10, row_y + 26), (x + w_box - 10, row_y + 26)], fill="#F1F5F9", width=1)
            row_y += 28

    # 1. auth.users (Top Left)
    auth_cols = [
        ("id", "UUID", "PK"),
        ("email", "TEXT", ""),
        ("encrypted_password", "TEXT", ""),
        ("raw_user_meta_data", "JSONB", ""),
        ("├── fullName", "TEXT (meta)", ""),
        ("├── role ('user'|'employer')", "TEXT (meta)", ""),
        ("└── companyName", "TEXT (meta)", ""),
        ("created_at", "TIMESTAMPTZ", "")
    ]
    draw_table_card(60, 110, 420, 310, "auth.users (Supabase Identity)", "#0F172A", auth_cols)

    # 2. jobs (Top Right)
    jobs_cols = [
        ("id", "UUID", "PK"),
        ("title", "TEXT", ""),
        ("description", "TEXT", ""),
        ("qualification", "TEXT", ""),
        ("ageLimit", "TEXT", ""),
        ("lastDate", "TEXT (ISO)", ""),
        ("vacancies", "INTEGER", ""),
        ("category", "TEXT", ""),
        ("color", "TEXT", ""),
        ("employer_id", "UUID", "FK"),
        ("employer_name", "TEXT", ""),
        ("created_at", "TIMESTAMPTZ", "")
    ]
    draw_table_card(550, 110, 450, 410, "jobs (Vacancies Catalog)", "#1E293B", jobs_cols)

    # 3. profiles (Bottom Left)
    profiles_cols = [
        ("email", "TEXT", "PK"),
        ("firstName", "TEXT", ""),
        ("middleName", "TEXT", ""),
        ("lastName", "TEXT", ""),
        ("fullName", "TEXT", ""),
        ("phone", "TEXT", ""),
        ("whatsapp", "TEXT", ""),
        ("address / city / country", "TEXT", ""),
        ("aboutMe (Bio)", "TEXT", ""),
        ("qualification", "TEXT", ""),
        ("experience", "TEXT", ""),
        ("skills (Proficiency map)", "JSONB", ""),
        ("created_at", "TIMESTAMPTZ", "")
    ]
    draw_table_card(60, 450, 420, 410, "profiles (Candidate Portfolios)", "#047857", profiles_cols)

    # 4. applications (Bottom Right)
    app_cols = [
        ("id", "UUID", "PK"),
        ("job_id", "UUID", "FK"),
        ("job_title", "TEXT", ""),
        ("user_email", "TEXT", "FK*"),
        ("user_name", "TEXT", ""),
        ("cv_name", "TEXT", ""),
        ("status ('Pending'|'Shortlisted'|'Rejected')", "TEXT", ""),
        ("created_at", "TIMESTAMPTZ", "")
    ]
    draw_table_card(550, 550, 450, 310, "applications (Submissions)", "#2563EB", app_cols)

    # 5. Legend & Architecture Notes (Right Column)
    draw_rounded_rect(draw, (1040, 110, 1540, 840), 20, "#FFFFFF", outline="#CBD5E1", width=2)
    draw_rounded_rect(draw, (1055, 125, 1525, 175), 14, "#0F172A")
    draw.text((1290, 150), "Relational Integrity & Business Rules", fill="#FFFFFF", font=get_font(17, bold=True), anchor="mm")

    rules = [
        ("1. Multi-Tenant Role Isolation", "auth.users securely manages identity and assigns roles ('user', 'employer', 'admin'). Employers are tied to their postings via employer_id.", "#EEF2FF", "#4F46E5"),
        ("2. Cascading Job Deletions", "jobs.id is referenced by applications.job_id with ON DELETE CASCADE constraint. Removing a job cleanly removes candidate applications.", "#FEF2F2", "#DC2626"),
        ("3. Profile-Application Association", "applications.user_email references profiles.email. Applications require a completed profile (phone & address) before submission.", "#F0FDF4", "#16A34A"),
        ("4. Flexible JSONB Skills Storage", "Candidate technical skill proficiencies are stored as dynamic JSONB key-value pairs (e.g. {'UI Design': 85, 'Programming': 70}), enabling adaptive candidate ranking.", "#FAF5FF", "#7C3AED"),
        ("5. Application Lifecycle Pipeline", "Every application defaults to 'Pending'. Employers and Administrators update status to 'Shortlisted' or 'Rejected', updating live applicant dashboards.", "#EFF6FF", "#2563EB")
    ]
    y_r = 195
    for r_title, r_desc, r_bg, r_border in rules:
        draw_rounded_rect(draw, (1060, y_r, 1520, y_r + 115), 12, r_bg, outline=r_border, width=1)
        draw.text((1075, y_r + 20), r_title, fill="#0F172A", font=get_font(14, bold=True))
        words = r_desc.split(" ")
        lines = []
        cur = ""
        for word in words:
            if len(cur + " " + word) < 46:
                cur = cur + " " + word if cur else word
            else:
                lines.append(cur)
                cur = word
        if cur:
            lines.append(cur)
        for idx, line in enumerate(lines[:3]):
            draw.text((1075, y_r + 44 + idx * 19), line, fill="#475569", font=get_font(12))
        y_r += 127

    # Draw Relation Lines with labels
    # Line 1: auth.users (id) -> jobs (employer_id)
    draw.line([(480, 200), (550, 200)], fill="#4F46E5", width=3)
    draw.polygon([(545, 195), (555, 200), (545, 205)], fill="#4F46E5")
    draw_rounded_rect(draw, (495, 185, 535, 215), 6, "#EEF2FF", outline="#4F46E5")
    draw.text((515, 200), "1 : N", fill="#4F46E5", font=get_font(11, bold=True), anchor="mm")

    # Line 2: jobs (id) -> applications (job_id)
    draw.line([(775, 520), (775, 550)], fill="#2563EB", width=3)
    draw.polygon([(770, 545), (775, 555), (780, 545)], fill="#2563EB")
    draw_rounded_rect(draw, (755, 525, 795, 545), 6, "#EFF6FF", outline="#2563EB")
    draw.text((775, 535), "1 : N", fill="#2563EB", font=get_font(11, bold=True), anchor="mm")

    # Line 3: profiles (email) -> applications (user_email)
    draw.line([(480, 680), (550, 680)], fill="#059669", width=3)
    draw.polygon([(545, 675), (555, 680), (545, 685)], fill="#059669")
    draw_rounded_rect(draw, (495, 665, 535, 695), 6, "#F0FDF4", outline="#059669")
    draw.text((515, 680), "1 : N", fill="#059669", font=get_font(11, bold=True), anchor="mm")

    img.save(filename, "PNG", dpi=(300, 300))
    print(f"Saved: {filename}")

def create_workflow_diagram(filename):
    w, h = 1600, 720
    img = Image.new("RGB", (w, h), "#F8FAFC")
    draw = ImageDraw.Draw(img)

    # Title
    draw_rounded_rect(draw, (40, 20, w - 40, 85), 14, "#0F172A")
    draw.text((w/2, 42), "Multi-Role Recruitment Workflow & Lifecycle Pipeline", fill="#FFFFFF", font=get_font(26, bold=True), anchor="mm")
    draw.text((w/2, 68), "Interactive Step-by-Step Operations for Job Seekers, Employers, and Administrators", fill="#94A3B8", font=get_font(15), anchor="mm")

    # 3 Lanes
    lanes = [
        ("Job Seeker Workflow", "#059669", 110, [
            ("1. Sign Up / Sign In", "Create account via Supabase Auth with candidate role"),
            ("2. Profile & Skills", "Fill personal details, upload bio, rate core competencies (JSONB)"),
            ("3. Browse & Filter Jobs", "Search active vacancies by title, category, keywords, and deadline"),
            ("4. Pre-Check & Apply", "Validate profile completeness; upload CV document; check deadline"),
            ("5. Live Tracking", "Monitor application status (Pending / Shortlisted / Rejected) on Dashboard")
        ]),
        ("Employer Workflow", "#2563EB", 310, [
            ("1. Employer Registration", "Register account with verified organization / company name"),
            ("2. Vacancy Creation", "Post job with title, description, qualifications, age limit, vacancies, deadline"),
            ("3. Dashboard Overview", "Track active vs expired job postings, applicant totals, and vacancy ratios"),
            ("4. Review Candidates", "Inspect received applications, search by applicant name or job role"),
            ("5. Lifecycle Actions", "One-click 'Shortlist' or 'Reject' candidates; notify applicant pipeline")
        ]),
        ("System Administrator", "#7C3AED", 510, [
            ("1. Secure Authentication", "Access restricted admin command center via authenticated portal"),
            ("2. Command Center", "High-level analytics: total vacancies, remaining slots, acceptance rates"),
            ("3. System-Wide Auditing", "Inspect all jobs across all employers; delete invalid listings"),
            ("4. Candidate Inspection", "Open detailed applicant modal: full CV info, skills progress, bio"),
            ("5. Platform Governance", "Oversee multi-tenant activity, ensure policy compliance & data hygiene")
        ])
    ]

    for lane_title, lane_color, y_pos, steps in lanes:
        # Lane container
        draw_rounded_rect(draw, (40, y_pos, w - 40, y_pos + 175), 16, "#FFFFFF", outline="#E2E8F0", width=2)
        # Lane Badge
        draw_rounded_rect(draw, (55, y_pos + 15, 230, y_pos + 160), 12, lane_color)
        draw.text((142, y_pos + 87), lane_title, fill="#FFFFFF", font=get_font(16, bold=True), anchor="mm")

        # 5 Steps
        step_w = 230
        x_start = 250
        for i, (s_title, s_desc) in enumerate(steps):
            box_x = x_start + i * 260
            draw_rounded_rect(draw, (box_x, y_pos + 15, box_x + step_w, y_pos + 160), 12, "#F8FAFC", outline="#CBD5E1", width=1)
            # Step header
            draw.text((box_x + 12, y_pos + 35), s_title, fill="#0F172A", font=get_font(13, bold=True))
            # Step desc
            words = s_desc.split(" ")
            lines = []
            cur = ""
            for word in words:
                if len(cur + " " + word) < 28:
                    cur = cur + " " + word if cur else word
                else:
                    lines.append(cur)
                    cur = word
            if cur:
                lines.append(cur)
            for idx, line in enumerate(lines[:4]):
                draw.text((box_x + 12, y_pos + 60 + idx * 18), line, fill="#64748B", font=get_font(11))

            # Draw arrow between steps
            if i < len(steps) - 1:
                arrow_x = box_x + step_w + 5
                arrow_y = y_pos + 87
                draw.polygon([(arrow_x, arrow_y - 6), (arrow_x + 18, arrow_y), (arrow_x, arrow_y + 6)], fill=lane_color)

    img.save(filename, "PNG", dpi=(300, 300))
    print(f"Saved: {filename}")

if __name__ == "__main__":
    create_architecture_diagram("diagram_architecture.png")
    create_er_diagram("diagram_er.png")
    create_workflow_diagram("diagram_workflow.png")

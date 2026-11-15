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

def create_compact_architecture_workflow(filename):
    # Width 1500, Height 500 (aspect ratio 3:1, renders to ~2.1 inches high at 6.5 in width)
    w, h = 1500, 500
    img = Image.new("RGB", (w, h), "#F8FAFC")
    draw = ImageDraw.Draw(img)

    # Title Banner
    draw_rounded_rect(draw, (20, 15, w - 20, 65), 10, "#0F172A")
    draw.text((w/2, 40), "JobBridge: End-to-End System Architecture & Multi-Role Workflow Pipeline", fill="#FFFFFF", font=get_font(20, bold=True), anchor="mm")

    # Column 1: Client Layer (Next.js 16 & UI)
    draw_rounded_rect(draw, (20, 80, 480, 480), 14, "#FFFFFF", outline="#CBD5E1", width=2)
    draw_rounded_rect(draw, (35, 92, 465, 132), 8, "#1E293B")
    draw.text((250, 112), "1. Presentation Layer (Next.js 16)", fill="#FFFFFF", font=get_font(15, bold=True), anchor="mm")

    c1_items = [
        ("Job Seeker Portal", "Public Browse /jobs, /apply/[id], /profile, /dashboard"),
        ("Employer Studio", "/employer/dashboard, /employer/jobs, /employer/applications"),
        ("Admin Center", "Command center, vacancy monitoring, /admin/jobs & applications"),
        ("Design System", "Tailwind CSS v4, Lucide Icons, Glassmorphic headers, responsive UI")
    ]
    y = 145
    for title, desc in c1_items:
        draw_rounded_rect(draw, (35, y, 465, y + 72), 8, "#F8FAFC", outline="#E2E8F0", width=1)
        draw.text((45, y + 16), title, fill="#0F172A", font=get_font(13, bold=True))
        draw.text((45, y + 42), desc, fill="#64748B", font=get_font(11))
        y += 82

    # Column 2: Application Context & Business Logic
    draw_rounded_rect(draw, (510, 80, 990, 480), 14, "#FFFFFF", outline="#CBD5E1", width=2)
    draw_rounded_rect(draw, (525, 92, 975, 132), 8, "#059669")
    draw.text((750, 112), "2. Context & Security Gatekeepers", fill="#FFFFFF", font=get_font(15, bold=True), anchor="mm")

    c2_items = [
        ("AuthContext (RBAC)", "JWT token lifecycle, role routing ('user', 'employer', 'admin')"),
        ("DataContext (State)", "Reactive caching, query dispatcher, real-time optimistic sync"),
        ("Gatekeeper Validation", "Automated lastDate expiry check & profile completeness audit"),
        ("Intelligence Engine", "JSONB skill mastery evaluation & real-time vacancy balancing")
    ]
    y = 145
    for title, desc in c2_items:
        draw_rounded_rect(draw, (525, y, 975, y + 72), 8, "#F0FDF4", outline="#BBF7D0", width=1)
        draw.text((535, y + 16), title, fill="#0F172A", font=get_font(13, bold=True))
        draw.text((535, y + 42), desc, fill="#475569", font=get_font(11))
        y += 82

    # Column 3: Supabase Cloud BaaS & Database
    draw_rounded_rect(draw, (1020, 80, 1480, 480), 14, "#FFFFFF", outline="#CBD5E1", width=2)
    draw_rounded_rect(draw, (1035, 92, 1465, 132), 8, "#2563EB")
    draw.text((1250, 112), "3. Supabase Cloud BaaS (PostgreSQL)", fill="#FFFFFF", font=get_font(15, bold=True), anchor="mm")

    c3_items = [
        ("Supabase Auth", "Bcrypt passwords, JWT issuance, secure user metadata"),
        ("PostgREST Engine", "Automated REST API generation & schema cache reload"),
        ("Relational Database", "Tables: 'jobs', 'applications', 'profiles', 'auth.users'"),
        ("Security & Indices", "Row-Level Security (RLS) policies & employer_id indexing")
    ]
    y = 145
    for title, desc in c3_items:
        draw_rounded_rect(draw, (1035, y, 1465, y + 72), 8, "#EFF6FF", outline="#BFDBFE", width=1)
        draw.text((1045, y + 16), title, fill="#0F172A", font=get_font(13, bold=True))
        draw.text((1045, y + 42), desc, fill="#475569", font=get_font(11))
        y += 82

    # Arrows between columns
    draw.polygon([(485, 275), (505, 280), (485, 285)], fill="#0F172A")
    draw.polygon([(995, 275), (1015, 280), (995, 285)], fill="#0F172A")

    img.save(filename, "PNG", dpi=(300, 300))
    print(f"Saved: {filename}")

def create_compact_er_diagram(filename):
    # Width 1500, Height 560
    w, h = 1500, 560
    img = Image.new("RGB", (w, h), "#F8FAFC")
    draw = ImageDraw.Draw(img)

    # Title
    draw_rounded_rect(draw, (20, 12, w - 20, 58), 10, "#0F172A")
    draw.text((w/2, 35), "Supabase Relational Database Schema & Entity Relationships", fill="#FFFFFF", font=get_font(20, bold=True), anchor="mm")

    def draw_entity(x, y, ew, eh, title, header_bg, fields):
        draw_rounded_rect(draw, (x, y, x + ew, y + eh), 12, "#FFFFFF", outline="#CBD5E1", width=2)
        draw_rounded_rect(draw, (x, y, x + ew, y + 36), 10, header_bg)
        draw.text((x + 14, y + 18), title, fill="#FFFFFF", font=get_font(14, bold=True), anchor="lm")
        fy = y + 44
        for name, ftype, key in fields:
            draw.text((x + 12, fy + 8), name, fill="#0F172A", font=get_font(11, bold=bool(key)), anchor="lm")
            draw.text((x + ew - 85, fy + 8), ftype, fill="#64748B", font=get_font(10), anchor="lm")
            if key:
                k_bg = "#4F46E5" if "PK" in key else "#059669"
                draw_rounded_rect(draw, (x + ew - 40, fy, x + ew - 8, fy + 17), 4, k_bg)
                draw.text((x + ew - 24, fy + 8), key, fill="#FFFFFF", font=get_font(9, bold=True), anchor="mm")
            draw.line([(x + 6, fy + 18), (x + ew - 6, fy + 18)], fill="#F1F5F9", width=1)
            fy += 20

    # 1. auth.users
    auth_f = [
        ("id", "UUID", "PK"),
        ("email", "TEXT", ""),
        ("encrypted_password", "TEXT", ""),
        ("raw_user_meta_data", "JSONB", ""),
        ("  ├── fullName", "TEXT", ""),
        ("  ├── role", "TEXT", ""),
        ("  └── companyName", "TEXT", ""),
        ("created_at", "TIMESTAMPTZ", "")
    ]
    draw_entity(30, 75, 330, 225, "auth.users (Identity)", "#0F172A", auth_f)

    # 2. jobs
    jobs_f = [
        ("id", "UUID", "PK"),
        ("title", "TEXT", ""),
        ("description", "TEXT", ""),
        ("qualification", "TEXT", ""),
        ("ageLimit", "TEXT", ""),
        ("lastDate (Deadline)", "TEXT", ""),
        ("vacancies", "INTEGER", ""),
        ("category", "TEXT", ""),
        ("employer_id", "UUID", "FK"),
        ("employer_name", "TEXT", ""),
        ("created_at", "TIMESTAMPTZ", "")
    ]
    draw_entity(400, 75, 350, 285, "jobs (Vacancies Catalog)", "#1E293B", jobs_f)

    # 3. profiles
    prof_f = [
        ("email", "TEXT", "PK"),
        ("fullName (firstName..)", "TEXT", ""),
        ("phone", "TEXT", ""),
        ("whatsapp", "TEXT", ""),
        ("address / city / country", "TEXT", ""),
        ("aboutMe (Bio)", "TEXT", ""),
        ("qualification / exp", "TEXT", ""),
        ("skills (Proficiency %)", "JSONB", ""),
        ("created_at", "TIMESTAMPTZ", "")
    ]
    draw_entity(30, 315, 330, 230, "profiles (Candidate Portfolios)", "#047857", prof_f)

    # 4. applications
    app_f = [
        ("id", "UUID", "PK"),
        ("job_id", "UUID", "FK"),
        ("job_title", "TEXT", ""),
        ("user_email", "TEXT", "FK*"),
        ("user_name", "TEXT", ""),
        ("cv_name", "TEXT", ""),
        ("status ('Pending'|'Shortlisted'|'Rejected')", "TEXT", ""),
        ("created_at", "TIMESTAMPTZ", "")
    ]
    draw_entity(400, 375, 350, 220, "applications (Submissions)", "#2563EB", app_f)

    # Right side: Architecture & Integrity Summary
    draw_rounded_rect(draw, (790, 75, 1470, 545), 14, "#FFFFFF", outline="#CBD5E1", width=2)
    draw_rounded_rect(draw, (805, 87, 1455, 127), 8, "#0F172A")
    draw.text((1130, 107), "Relational Constraints & Data Flow Rules", fill="#FFFFFF", font=get_font(15, bold=True), anchor="mm")

    rules = [
        ("1. Multi-Tenant Role Isolation (1 : N)", "auth.users assigns 'user', 'employer', or 'admin'. Employers are linked to their postings via jobs.employer_id, ensuring strict workspace isolation.", "#EEF2FF", "#4F46E5"),
        ("2. Cascading Referential Integrity (1 : N)", "applications.job_id references jobs.id with ON DELETE CASCADE. Deleting a vacancy automatically cascades to prune all child applications.", "#EFF6FF", "#2563EB"),
        ("3. Candidate Profile Association (1 : N)", "applications.user_email links logically to profiles.email. Candidate contact completeness (phone and address) is pre-validated before submission.", "#F0FDF4", "#059669"),
        ("4. JSONB Dynamic Skill Matrix", "Candidate technical proficiencies are stored as dynamic JSONB maps (e.g. {'UI Design': 85, 'React': 80}), allowing flexible skill modeling without schema alterations.", "#FAF5FF", "#7C3AED"),
        ("5. Application Lifecycle Pipeline", "Status transitions ('Pending' -> 'Shortlisted' / 'Rejected') updated via PostgREST with live vacancy recalculation (Remaining = Total - Shortlisted).", "#FFFBEB", "#D97706")
    ]
    ry = 140
    for r_title, r_desc, r_bg, r_border in rules:
        draw_rounded_rect(draw, (810, ry, 1450, ry + 73), 8, r_bg, outline=r_border, width=1)
        draw.text((822, ry + 16), r_title, fill="#0F172A", font=get_font(12, bold=True))
        # word wrap
        words = r_desc.split(" ")
        lines, cur = [], ""
        for w_word in words:
            if len(cur + " " + w_word) < 58:
                cur = cur + " " + w_word if cur else w_word
            else:
                lines.append(cur)
                cur = w_word
        if cur:
            lines.append(cur)
        for idx, line in enumerate(lines[:2]):
            draw.text((822, ry + 36 + idx * 16), line, fill="#475569", font=get_font(10.5))
        ry += 80

    # Draw relation arrows
    # auth.users -> jobs
    draw.line([(360, 140), (400, 140)], fill="#4F46E5", width=2)
    draw.polygon([(395, 136), (403, 140), (395, 144)], fill="#4F46E5")

    # jobs -> applications
    draw.line([(575, 360), (575, 375)], fill="#2563EB", width=2)
    draw.polygon([(571, 370), (575, 378), (579, 370)], fill="#2563EB")

    # profiles -> applications
    draw.line([(360, 440), (400, 440)], fill="#059669", width=2)
    draw.polygon([(395, 436), (403, 440), (395, 444)], fill="#059669")

    img.save(filename, "PNG", dpi=(300, 300))
    print(f"Saved: {filename}")

if __name__ == "__main__":
    create_compact_architecture_workflow("fig1_architecture_workflow.png")
    create_compact_er_diagram("fig2_database_er.png")

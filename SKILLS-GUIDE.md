# מדריך סקילים — מה שווה להתקין ל-Claude Code

> מדריך מסודר לסקילים (Skills) של Claude Code ששווה להתקין, מותאם לפרויקט הזה
> (סטודיו עיצוב בעברית, Next.js + Three.js + GSAP) ולעבודה עם AI.
> נכון לזמן הבדיקה — כוכבים = כמה מומלץ **בשבילך**.

---

## ✅ צריך להתקין — צ'קליסט פעולה (למי שממשיך מכאן)

**הסקילים הבאים צריכים להיות מותקנים. התקן אותם לפי הסדר:**

- [ ] **theme-factory** — מ-`anthropics/skills` → לתוך `.claude/skills/theme-factory/` → commit
- [ ] **canvas-design** — מ-`anthropics/skills` → לתוך `.claude/skills/canvas-design/` → commit
- [ ] **webapp-testing** — מ-`anthropics/skills` → לתוך `.claude/skills/webapp-testing/` → commit
- [ ] **Superpowers** — `/plugin marketplace add obra/superpowers-marketplace` → `/plugin install superpowers@superpowers-marketplace`
- [ ] **agent-reach** — **מקומי בלבד**: `pip install agent-reach && agent-reach install` (ראה `AGENT-REACH-SETUP.md`)
- [ ] **Destructive Command Guard** — **מקומי בלבד**: `install.sh --easy-mode` (בטיחות)

**כבר מותקן (לא לגעת):** `frontend-design`, `no-ai-slop`, `i-have-adhd`.

> הפקודה המהירה להתקנת שלושת הסקילים מ-anthropic נמצאת בהמשך, בסעיף "התקנה קבוצתית".

---

## איך בכלל מתקינים סקיל (3 שיטות)

| שיטה | פקודה / פעולה | מתי |
|------|----------------|-----|
| **1. Plugin marketplace** | `/plugin marketplace add <owner>/<repo>` ואז `/plugin install <name>@<marketplace>` | לסקילים שמופצים כ-plugin (Superpowers וכו') |
| **2. העתקה ידנית** | להעתיק תיקייה ל-`.claude/skills/<name>/` (עם `SKILL.md`) ולעשות commit | לסקיל בודד מריפו (ככה התקנו `no-ai-slop`) |
| **3. skills CLI** | `npx skills add <owner>/<repo>` | סקילים שתומכים בכלי `skills` (למשל Supabase) |

> **הבחנה חשובה:** סקיל שמותקן **בריפו** (`.claude/skills/`) עובר ב-git ונשאר לכולם/בכל מכונה.
> סקיל שמותקן דרך plugin/CLI לרוב יושב **גלובלי** על המחשב (`~/.claude/`) ולא עובר בריפו.

---

## ⭐ המומלצים בשבילך (טופ)

| סקיל | מה נותן | למה בשבילך | התקנה |
|------|---------|-------------|--------|
| **Superpowers** ⭐⭐⭐ | מסגרת עבודה שלמה: brainstorm → spec → plan → TDD → review. 20+ סקילים + פקודות `/brainstorm`, `/write-plan` | הופך את Claude ממחולל קוד ל"מפתח בכיר" מסודר. השדרוג הכי גדול | `/plugin marketplace add obra/superpowers-marketplace` → `/plugin install superpowers@superpowers-marketplace` ([repo](https://github.com/obra/superpowers)) |
| **theme-factory** ⭐⭐⭐ | 10 ערכות עיצוב מוכנות + יצירת theme מותאם (צבע/פונטים) | סטודיו עיצוב — עקביות מותג בין דפים/ארטיפקטים | מ-[`anthropics/skills`](https://github.com/anthropics/skills) → `skills/theme-factory` |
| **canvas-design** ⭐⭐⭐ | עיצוב ויזואלים איכותיים ל-PNG/PDF לפי עקרונות עיצוב | פוסטרים, מצגות, מוקאפים לסטודיו | מ-[`anthropics/skills`](https://github.com/anthropics/skills) → `skills/canvas-design` |
| **brand-guidelines** ⭐⭐ | אכיפת שפת מותג (צבעים, טיפוגרפיה, טון) | לשמור על זהות אחידה לאתר ולחומרי שיווק | מ-`anthropics/skills` → `skills/brand-guidelines` |
| **webapp-testing** ⭐⭐ | בדיקות אוטומטיות לאתר (Playwright) | לוודא שהאתר עובד — Playwright כבר מותקן בסביבה | מ-`anthropics/skills` → `skills/webapp-testing` |

---

## סקילים רשמיים של Anthropic — [`github.com/anthropics/skills`](https://github.com/anthropics/skills)

17 סקילים רשמיים. **חלקם כבר זמינים אצלך בסביבת ה-web** (built-in), אבל אם תרצה אותם גם **בריפו/מקומית** — מעתיקים מהריפו.

| סקיל | מה עושה | כבר זמין ב-web? |
|------|---------|:---------------:|
| `frontend-design` | עיצוב frontend מובחן | ✅ (מותקן בריפו) |
| `theme-factory` | ערכות עיצוב לארטיפקטים | ➕ שווה להוסיף |
| `canvas-design` | ויזואלים ל-PNG/PDF | ➕ שווה להוסיף |
| `brand-guidelines` | שפת מותג עקבית | ➕ שווה להוסיף |
| `web-artifacts-builder` | בניית ארטיפקטים אינטראקטיביים | ➕ |
| `webapp-testing` | בדיקות אפליקציה (Playwright) | ➕ |
| `mcp-builder` | לבנות שרתי MCP (כלים מותאמים) | ➕ אם תרצה כלים משלך |
| `skill-creator` | ליצור/לשפר סקילים | ✅ |
| `docx` / `pdf` / `pptx` / `xlsx` | מסמכי Word/PDF/PowerPoint/Excel | ✅ |
| `algorithmic-art` | אמנות גנרטיבית בקוד | ➕ (כיף לסטודיו) |
| `doc-coauthoring` | כתיבה משותפת של מסמכים | ➕ |
| `claude-api` | רפרנס ל-API/SDK של Claude | ✅ |
| `brand-guidelines`, `internal-comms`, `slack-gif-creator` | ארגוני/שיווקי | לפי צורך |

**התקנה קבוצתית מ-anthropic:**
```bash
git clone https://github.com/anthropics/skills.git /tmp/anthropic-skills
cp -r /tmp/anthropic-skills/skills/theme-factory   .claude/skills/
cp -r /tmp/anthropic-skills/skills/canvas-design   .claude/skills/
cp -r /tmp/anthropic-skills/skills/webapp-testing  .claude/skills/
# ...הוסף מה שתרצה, ואז commit
```
> ⚠️ הסקילים של anthropic הם "source-available" (לא רישיון קוד-פתוח מלא) — לשימוש/לימוד. בסדר לשימוש אישי בפרויקט.

---

## סקילים קהילתיים בולטים

| סקיל | מה נותן | הערה |
|------|---------|------|
| **Karpathy behavioral skill** | חוסם 3 כשלים: הנחות שקטות שגויות, over-engineering (50 שורות שהופכות ל-500), שינויים במקומות שלא ביקשת | קובץ יחיד, אפס תלויות. חפש בגיטהאב "karpathy behavioral skill" ואמת את הריפו לפני התקנה |
| **Firecrawl skill** | scraping/search/crawl של אתרים דרך Firecrawl CLI | רלוונטי למטרת "לקרוא את הרשת". **צריך רשת פתוחה** (ב-web חסום — ראה למטה) |
| **Supabase agent skill** | הנחיות פיתוח ואבטחה ל-Supabase | Supabase כבר מחובר אצלך כ-MCP! התקנה: `npx skills add supabase/agent-skills` |
| **agent-reach** | קריאת יוטיוב/רדיט/טוויטר וכו' דרך CLI (yt-dlp) | ראה `AGENT-REACH-SETUP.md`. **מקומי בלבד** |

---

## מהסרטון (RoboNuggets) — סטטוס

| משאב | סוג | סטטוס |
|------|-----|--------|
| `no-ai-slop` | סקיל | ✅ מותקן בריפו |
| `i-have-adhd` | סקיל | ✅ מותקן בריפו |
| Destructive Command Guard | hook בטיחות | מקומי בלבד (`install.sh`, משנה `~/.claude/settings.json`) |
| CanvasUI | ספריית קוד (shadcn) | לא סקיל — `npx shadcn@latest add https://canvasui.dev/r/<name>.json` |
| thinking-orbs | חבילת npm | לא סקיל — `npm install thinking-orbs` |

---

## ⚠️ הערת רשת — למה חלק לא יעבוד ב-web

בסביבת ה-web של Claude Code הרשת חסומה כמעט לחלוטין (יציאה ישירה = 403, חוץ מ-pypi/npm).
כל סקיל שצריך **רשת חיצונית** — Firecrawl, agent-reach, Supabase מרוחק — **לא יעבוד ב-web**.
במחשב **מקומי** אין את החסימה הזו, והכל עובד.

- סקילי **עיצוב/מסמכים/workflow** (Superpowers, theme-factory, canvas-design, webapp-testing) — עובדים בכל מקום. **התחל מהם.**
- סקילי **גישה לרשת** (Firecrawl, agent-reach) — למחשב המקומי.

---

## 📋 פרומפט פתיחה — מה להדביק ל-Claude המקומי (כדי שיבין לפני שיעשה)

העתק את הבלוק הזה כהודעה ראשונה בשיחה מקומית חדשה בתוך תיקיית הפרויקט:

```
הקשר: זה פרויקט harel-studio — אתר סטודיו בעברית (RTL), Next.js 16 + Three.js + GSAP.
אנחנו בענף claude/skills-installation-review-0disuf.

לפני שאתה עושה משהו:
1. קרא את שני הקבצים בשורש: SKILLS-GUIDE.md ו-AGENT-REACH-SETUP.md. הם מסבירים את כל ההקשר.
2. הרץ `git status` ו-`ls .claude/skills/` כדי לראות מה כבר מותקן (frontend-design, no-ai-slop, i-have-adhd).
3. אל תשנה קוד של האתר עצמו (app/, components/) בלי לשאול אותי קודם.

המשימה: עזור לי להתקין את הסקילים ששווה, לפי SKILLS-GUIDE.md, בסדר הזה:
  א. התקן מ-anthropics/skills את theme-factory, canvas-design, webapp-testing לתוך .claude/skills/
  ב. הסבר לי איך מתקינים את Superpowers (plugin marketplace) — אני ארוץ את הפקודות.
  ג. התקן את agent-reach מקומית ומשוך תמלול מ-https://youtu.be/FCahQgfV4_0 כבדיקה.

כללים:
- לפני כל פעולה לא-הפיכה (מחיקה, push, שינוי הגדרות גלובליות) — תעצור ותשאל.
- אחרי כל שלב תגיד לי בדיוק מה עשית ומה השלב הבא.
- אל תמציא פקודות. אם אתה לא בטוח בפקודה מדויקת — קרא את ה-README של הריפו קודם.
- כל התקנת סקיל בריפו → commit עם הודעה ברורה. אל תעשה push בלי לשאול.
```

**למה זה עובד:** הפרומפט נותן ל-Claude (א) הקשר על הפרויקט, (ב) מה כבר קיים, (ג) גבולות ברורים (לא לגעת בקוד/לא push בלי אישור), (ד) משימה בשלבים. ככה הוא **מבין לפני שהוא עושה**.

---

## TL;DR — סדר פעולות מומלץ

1. **עכשיו, בריפו:** הוסף `theme-factory` + `canvas-design` + `webapp-testing` מ-`anthropics/skills`.
2. **workflow:** התקן **Superpowers** (`/plugin marketplace add obra/superpowers-marketplace`).
3. **מקומית:** התקן `agent-reach` (יוטיוב) + Destructive Command Guard (בטיחות).
4. כבר יש: `frontend-design`, `no-ai-slop`, `i-have-adhd`.
5. הכל שמור בענף `claude/skills-installation-review-0disuf` — לא בצ'אט.

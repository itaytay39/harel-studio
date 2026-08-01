# סיכום והוראות המשך — יכולת "לראות" יוטיוב (Agent-Reach)

> קובץ הסבר יחיד. פתח שיחה **מקומית** של Claude Code בתוך התיקייה הזו, תן ל-Claude לקרוא את הקובץ, והוא ידע להמשיך מכאן.

---

## 1. איפה אנחנו עומדים

- **ריפו:** `itaytay39/harel-studio`
- **ענף:** `claude/skills-installation-review-0disuf`
- **הפרויקט:** אתר סטודיו בעברית (RTL), Next.js 16 + Three.js + GSAP.

**סקילים שכבר מותקנים** (בתוך `.claude/skills/`):

| סקיל | מה עושה | סטטוס |
|------|---------|--------|
| `frontend-design` | הנחיות עיצוב frontend (היה קיים) | ✅ |
| `no-ai-slop` | ניקוי 20+ תבניות "AI slop" מטקסט | ✅ הותקן |
| `i-have-adhd` | עיצוב פלט: פעולה קודם, שלבים ממוספרים | ✅ הותקן |

---

## 2. מה רצינו — ולמה זה לא עבד ב-web

**המטרה:** ש-Claude יוכל לקרֹא תוכן ישירות מיוטיוב (ומאתרים) — תמלול, מטא-דאטה — במקום צילומי מסך ידניים.

**הכלי הנכון לזה:** [`Agent-Reach`](https://github.com/Panniantong/Agent-Reach) (MIT, קוד פתוח). זה **CLI** שמתקין סקרייפרים בקוד פתוח (בעיקר `yt-dlp` ליוטיוב, וגם Jina/Exa) ונותן לכל אג'נט שמריץ shell לקרוא 13+ פלטפורמות **בלי API keys**.

**למה זה לא עובד בסביבת ה-web (Claude Code on the web):**
בדקנו בפועל. מדיניות הרשת של סביבת ה-web חוסמת יציאה ישירה כמעט לכל האינטרנט:

```
youtube.com    -> 403 (חסום)
example.com    -> 403 (חסום)
r.jina.ai      -> 403 (חסום)
pypi / npm     -> מותר (לכן pip install עבד)
```

זו **מדיניות רשת של הסביבה**, לא בעיה בכלי ולא חוסר בסקיל. שום סקיל לא יעקוף חסימת רשת.

**המסקנה:** להריץ את זה **מקומית** — שם אין proxy חוסם, והכל עובד.

---

## 3. הוראות התקנה — במחשב המקומי שלך

הרץ בטרמינל (צריך Python 3.9+):

```bash
# 1. התקנה
pip install agent-reach

# 2. התקנה + הגדרה של הכלים שמאחורי הקלעים (yt-dlp וכו')
agent-reach install

# 3. בדיקת תקינות
agent-reach doctor
```

> אם `pip` לא מזוהה נסה `pip3` / `python3 -m pip`.
> `agent-reach install` מוריד כלים כמו `yt-dlp` — צריך אינטרנט פתוח (במקומי יש).

### בדיקה שזה עובד — משיכת תמלול מהסרטון שהתחלנו ממנו

```bash
# מטא-דאטה
yt-dlp --skip-download --print "%(title)s | %(channel)s" "https://youtu.be/FCahQgfV4_0"

# תמלול אוטומטי (כתוביות) בלי להוריד וידאו
yt-dlp --write-auto-sub --sub-lang "iw,en" --skip-download \
       -o "%(title)s.%(ext)s" "https://youtu.be/FCahQgfV4_0"
```

הפקודות המדויקות של agent-reach לכל פלטפורמה נמצאות ב-README שלו — תן ל-Claude המקומי לקרוא אותו.

---

## 4. מה להגיד ל-Claude בשיחה המקומית (פרומפט מוכן להעתקה)

```
קרא את הקובץ AGENT-REACH-SETUP.md בשורש הפרויקט.
התקן את agent-reach מקומית (pip install agent-reach && agent-reach install && agent-reach doctor),
ואז משוך לי את התמלול של הסרטון https://youtu.be/FCahQgfV4_0 וסכם לי אותו.
מעכשיו, כשאשלח לך קישור יוטיוב — משוך תמלול עם yt-dlp והבן ממנו, בלי לבקש ממני צילומי מסך.
```

---

## 5. שאר המשאבים מהסרטון (RoboNuggets) — לתיעוד

| # | משאב | מה זה | מה לעשות איתו |
|---|------|-------|----------------|
| 1 | **Destructive Command Guard** ([repo](https://github.com/Dicklesworthstone/destructive_command_guard)) | hook בטיחות שחוסם פקודות הרסניות (`rm -rf`, `git reset --hard`) | להתקין **מקומית** בלבד: `curl -fsSL .../install.sh \| bash -s -- --easy-mode`. משנה את `~/.claude/settings.json` הגלובלי — לא חלק מהריפו |
| 2 | **CanvasUI** ([site](https://canvasui.dev)) | ספריית אפקטי WebGL/Canvas (Liquid, Glass, Shatter...) — **לא סקיל**, קוד לפרויקט | `npx shadcn@latest add https://canvasui.dev/r/<name>.json` — מזריק קוד מקור. מתאים לאתר הקולנועי |
| 3 | **thinking-orbs** (Jakub Antalik, [site](https://orbs.jakubantalik.com)) | אינדיקטורי סטטוס מונפשים (canvas 2D, zero-deps) — **לא סקיל**, npm | `npm install thinking-orbs` |
| 4 | **no-ai-slop** | סקיל עריכת טקסט | ✅ כבר מותקן בריפו |
| 5 | **i-have-adhd** | סקיל עיצוב פלט | ✅ כבר מותקן בריפו |

---

## 6. TL;DR

1. ב-**web** יוטיוב חסום ברמת הרשת — אי אפשר לתקן מבפנים.
2. ב-**מקומי** זה עובד: `pip install agent-reach && agent-reach install`.
3. הסקילים `no-ai-slop` ו-`i-have-adhd` כבר בריפו, בענף `claude/skills-installation-review-0disuf`.
4. הכל שמור בריפו — לא בצ'אט. אל תחפש שיחות, חפש את הענף.

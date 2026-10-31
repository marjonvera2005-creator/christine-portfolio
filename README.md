# Christine Elaine Oliverio | Portfolio

A responsive personal portfolio website for Christine Elaine Oliverio, a fourth-year Bachelor of Computer Science student from Leyte, Philippines.

**Live site:** _add the public URL after deployment_

## Sections

- **Home:** introduction and links to projects and contact
- **About:** background, location and email
- **Skills:** the languages Christine works with
- **What I Do:** web development, UI/UX design, software testing and documentation
- **Projects:** IntelliGuide, ExploreBIL and A Letter For You, each with a details pop-up and screenshot gallery
- **Certificates:** seminars and courses, viewable at full size
- **Beyond the Code:** a sliding row of photos from life outside programming, viewable at full size
- **Contact:** email and social links, plus a contact drawer

## Built with

- HTML5 semantic elements
- CSS Grid, Flexbox and custom properties, with no framework
- JavaScript with no framework
- Google Fonts (Outfit and Inter), Font Awesome icons and Devicon logos

## Project structure

```
index.html              Page content
style.css               Design tokens, components and responsive layout
script.js               Navigation, theme, galleries, pop-ups and animations
images/
  beyond/               Beyond the Code photos
  certificates/         Certificate images
  projects/             Project screenshots
  portrait-*.jpg        Portrait photos
```

## Design and responsive approach

- **Color:** a sunset-over-the-sea palette defined as CSS custom properties, with light and dark themes.
- **Type:** Outfit for headings and Inter for body text.
- **Mobile-first CSS:** the base styles are the phone layout, with breakpoints added at `600px`, `768px` and `960px`.
- **Navigation:** a menu button below `960px` and a full navigation bar from `960px` up.
- **Accessibility:** visible keyboard focus, 44px touch targets on phone and tablet layouts, descriptive alt text, keyboard access to pop-ups and certificates, and reduced-motion support.

## Run it locally

Open `index.html` in a browser. There is no build step.

## Testing

Tested locally in Chrome 156 and Edge 156 at widths of 360, 600, 768, 959, 960 and 1440px, using both color themes across those widths.

| Check | Result |
|---|---|
| HTML validation (W3C Nu validator) | No errors |
| CSS validation (W3C Nu validator) | 2 parse errors on the valid `::view-transition` selectors, which the validator does not recognize |
| Horizontal scrolling | None at any tested width |
| Images | All site images load |
| Navigation links | All reach their sections |
| Project pop-ups and galleries | Working, including keyboard zoom and Escape |
| Certificates | Open by mouse and keyboard, and focus returns afterward |
| Contact drawer and theme toggle | Working |

**Not yet tested:** a physical phone, the deployed site, and browsers other than Chrome and Edge. Add the results here once these are done.

## Fixes made during testing

- Fixed HTML validator errors, including skipped heading levels, an invalid favicon link and invalid ARIA use.
- Rebuilt the responsive CSS from desktop-first to mobile-first.
- Moved the full navigation bar to `960px` so it has enough room.
- Raised phone and tablet touch targets to at least 44px and added visible keyboard focus.
- Made certificates and gallery images open from the keyboard.
- Stopped the skills logo row from showing a gap after the list was shortened.
- Merged duplicate CSS rules and gave image files descriptive names.
- Blurred personal location details in the IntelliGuide screenshots and removed a private message from the project images.

## IntelliGuide team

- **Team Leader:** Eliza Marie Rosario
- **Assistant Team Leader:** Christine Elaine Oliverio
- **Developer:** Marjon Vera
- **Assistant Developer:** Carl Marco Vaporoso

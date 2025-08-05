# HomeShow Web Popup

A mobile-first React application for realtors to send legally compliant Meeting Agreement Forms via SMS that open in a web popup for fast e-signature.

## Features

- 📱 **Mobile-first design** optimized for smartphone screens
- ✍️ **Electronic signature capture** with touch/draw support
- 🏛️ **State-specific compliance** with legal disclaimers
- 📄 **PDF generation** with audit trail
- 🔒 **ESIGN Act compliant** electronic signatures
- ⚡ **Fast loading** with minimal friction

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Architecture

### Components
- `App.jsx` - Main application container
- `RealtorInfo.jsx` - Displays realtor branding and contact info
- `AgreementForm.jsx` - Multi-step form with consent, agreement review, and signature
- `SignaturePad.jsx` - Touch-enabled signature capture
- `SuccessScreen.jsx` - Confirmation screen with download options

### Key Features
- **Multi-step flow**: Consent → Agreement Review → Signature → Success
- **Mobile-optimized**: Touch-friendly interface with responsive design
- **Legal compliance**: ESIGN Act compliant with state-specific disclaimers
- **Audit trail**: IP tracking, timestamps, and user agent logging
- **PDF export**: Generated agreements with professional formatting

## Production Deployment

This web popup is designed to be embedded in SMS links sent by the HomeShow iOS app. The URL structure would typically be:

```
https://homeshow.com/agreement/{agreementId}?token={securityToken}
```

## Security Considerations

- HTTPS required for production
- Expiring links (24-48 hours)
- IP tracking for audit trail
- Encrypted PDF storage
- Token-based authentication

## Tech Stack

- **Frontend**: React 18, Tailwind CSS
- **PDF Generation**: jsPDF, html2canvas
- **Signature**: Custom canvas-based signature pad
- **Styling**: Tailwind CSS with custom components

## License

Proprietary - HomeShow Inc. 
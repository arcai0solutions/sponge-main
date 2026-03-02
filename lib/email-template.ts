export function generateProposalEmail(
    name: string,
    company: string,
    employeeCount: number,
    services: string[],
    totalPrice: number
) {
    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
    }).format(totalPrice);

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Sponge Global Proposal</title>
        <style>
            body { margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
            .container { max-width: 600px; margin: 40px auto; background-color: #000000; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.2); }
            .header { background-color: #111111; padding: 40px 40px; text-align: center; border-bottom: 2px solid #E31E24; }
            .header img { max-width: 150px; }
            .content { padding: 40px; color: #ffffff; }
            h1 { color: #ffffff; font-size: 24px; margin-bottom: 10px; font-weight: 600; }
            p { color: #cccccc; font-size: 16px; line-height: 1.6; margin-bottom: 20px; }
            .details-box { background-color: #1a1a1a; border: 1px solid #333333; border-radius: 8px; padding: 25px; margin: 30px 0; }
            .detail-row { margin-bottom: 15px; display: flex; align-items: baseline; }
            .detail-row:last-child { margin-bottom: 0; }
            .detail-label { color: #888888; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; width: 140px; font-weight: bold; }
            .detail-value { color: #ffffff; font-size: 16px; font-weight: 500; }
            .price-box { text-align: center; border-top: 1px solid #333333; padding-top: 25px; margin-top: 25px; }
            .price-label { color: #E31E24; font-size: 14px; text-transform: uppercase; font-weight: bold; letter-spacing: 1px; margin-bottom: 5px; }
            .price-value { color: #ffffff; font-size: 36px; font-weight: bold; }
            .footer { background-color: #111111; padding: 30px 40px; text-align: center; border-top: 1px solid #222222; }
            .footer p { color: #666666; font-size: 13px; margin: 0; }
            .btn { display: inline-block; background-color: #E31E24; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: bold; margin-top: 10px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <!-- Using a placeholder logo or text if actual logo URL isn't hosted publicly yet -->
                <h2 style="color: #E31E24; margin: 0; font-size: 28px; letter-spacing: 2px; text-transform: uppercase;">SPONGE GLOBAL</h2>
            </div>
            
            <div class="content">
                <h1>Custom Proposal for ${company}</h1>
                <p>Hi ${name},</p>
                <p>Thank you for inquiring about our capability and transformational learning services. Based on the details provided to our AI strategist, we have generated an estimated investment summary for your organization.</p>
                
                <div class="details-box">
                    <div style="margin-bottom: 15px;">
                        <span class="detail-label">Client Name:</span>
                        <span class="detail-value">&nbsp;${name}</span>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <span class="detail-label">Company:</span>
                        <span class="detail-value">&nbsp;${company}</span>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <span class="detail-label">Workforce:</span>
                        <span class="detail-value">&nbsp;${employeeCount} Employees</span>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <span class="detail-label">Selected Services:</span><br/>
                        <span class="detail-value" style="display: block; margin-top: 5px; line-height: 1.5;">
                            ${services.map(s => `• ${s}`).join('<br/>')}
                        </span>
                    </div>
                    
                    <div class="price-box">
                        <div class="price-label">Estimated Investment</div>
                        <div class="price-value">${formattedPrice}</div>
                        <p style="font-size: 12px; color: #666; margin-top: 10px;">*Taxes and travel expenses not included in base estimate.</p>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 30px;">
                    <p>Ready to move forward or need adjustments?</p>
                    <a href="https://sponge-global.com/contact" class="btn">Schedule Strategy Call</a>
                </div>
            </div>
            
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Sponge Global. All rights reserved.</p>
                <p style="margin-top: 5px;">This is an automated demo proposal generated by ARC AI.</p>
            </div>
        </div>
    </body>
    </html>
    `;
}

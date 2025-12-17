// Vercel Serverless Function for Incidents API
export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    
    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // Demo data
    const demoIncidents = [
        {
            id: 1,
            title: "Фишинговая атака",
            description: "Обнаружены фишинговые письма сотрудникам",
            severity: 3,
            status: "open",
            createdAt: "2024-01-15T10:30:00Z",
            confidential: false
        },
        {
            id: 2,
            title: "Утечка данных клиентов",
            description: "Подозрение на утечку персональных данных",
            severity: 5,
            status: "in-progress",
            createdAt: "2024-01-14T09:15:00Z",
            confidential: true
        }
    ];
    
    // Handle different methods
    switch (req.method) {
        case 'GET':
            return res.status(200).json({
                success: true,
                data: demoIncidents,
                timestamp: new Date().toISOString()
            });
            
        case 'POST':
            // Simulate creating new incident
            const newIncident = {
                id: demoIncidents.length + 1,
                ...req.body,
                createdAt: new Date().toISOString(),
                status: 'open'
            };
            
            return res.status(201).json({
                success: true,
                data: newIncident,
                message: "Инцидент создан (демо-режим)"
            });
            
        default:
            return res.status(405).json({
                success: false,
                message: "Method not allowed"
            });
    }
}
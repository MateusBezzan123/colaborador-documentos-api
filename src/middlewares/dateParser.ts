import { Request, Response, NextFunction } from 'express';

export const parseDateFields = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.body) {
      fields.forEach(field => {
        if (req.body[field]) {
          const dateStr = req.body[field];
          
          if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            console.log(`Formato ISO detectado:`, dateStr);
          }

          else if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
            const [day, month, year] = dateStr.split('/');
            req.body[field] = `${year}-${month}-${day}`;
            console.log(`Convertido DD/MM/YYYY para:`, req.body[field]);
          }
          else if (/^\d{8}$/.test(dateStr)) {
            const day = dateStr.substring(0, 2);
            const month = dateStr.substring(2, 4);
            const year = dateStr.substring(4, 8);
            req.body[field] = `${year}-${month}-${day}`;
            console.log(`Convertido DDMMYYYY para:`, req.body[field]);
          }
          else {
            const date = new Date(dateStr);
            if (!isNaN(date.getTime())) {
              req.body[field] = date.toISOString().split('T')[0];
              console.log(`Convertido de Date para:`, req.body[field]);
            }
          }
        }
      });
    }
    next();
  };
};
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, MoreHorizontal, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as htmlToImage from 'html-to-image';

interface ChartContainerProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  description,
  children,
  className,
}) => {
  const [isExporting, setIsExporting] = useState(false);

  // Extract height classes from className
  const heightMatch = className?.match(/h-\d+|h-\[[\d\w]+\]/);
  const heightClass = heightMatch ? heightMatch[0] : 'h-80'; // Default height
  const otherClasses = className?.replace(/h-\d+|h-\[[\d\w]+\]/g, '').trim();

  const exportAsPNG = async () => {
    setIsExporting(true);
    try {
      const element = document.getElementById(`chart-${title.replace(/\s+/g, '-').toLowerCase()}`);
      if (element) {
        const dataUrl = await htmlToImage.toPng(element);
        const link = document.createElement('a');
        link.download = `${title.replace(/\s+/g, '-').toLowerCase()}.png`;
        link.href = dataUrl;
        link.click();
      }
    } catch (error) {
      console.error('Failed to export chart:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className={cn('hover:shadow-lg transition-shadow', otherClasses)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-lg font-semibold text-[#1A1A1A] dark:text-white">
            {title}
          </CardTitle>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={exportAsPNG} disabled={isExporting}>
              <Download className="mr-2 h-4 w-4" />
              Export as PNG
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div id={`chart-${title.replace(/\s+/g, '-').toLowerCase()}`} className={heightClass}>
          {children}
        </div>
      </CardContent>
    </Card>
  );
};
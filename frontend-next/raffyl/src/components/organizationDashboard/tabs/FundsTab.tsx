import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function FundsTab() {
  return (
    <div className="space-y-4">
      <Card className="bg-gray-900/40 border-gray-800">
        <CardHeader>
          <CardTitle>Funds Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300">Your fund management dashboard will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}

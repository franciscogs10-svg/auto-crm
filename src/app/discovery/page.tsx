import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, FlaskConical, Users, Target } from 'lucide-react';

export default function DiscoveryPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Product Discovery & Experimentation</h1>
        <p className="text-muted-foreground mt-2">
          Validate assumptions before building. Test fast, learn faster.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Discovery projects in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assumptions</CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">To test</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Experiments</CardTitle>
            <FlaskConical className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interviews</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">User insights captured</p>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started */}
      <Card>
        <CardHeader>
          <CardTitle>Get Started</CardTitle>
          <CardDescription>
            Start validating your product ideas with structured discovery
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="font-semibold">1. Create a Project</h3>
              <p className="text-sm text-muted-foreground">
                Open Claude Code and run <code className="bg-muted px-1 py-0.5 rounded">/create-project</code>
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">2. Conduct Interviews</h3>
              <p className="text-sm text-muted-foreground">
                Talk to users and capture insights with <code className="bg-muted px-1 py-0.5 rounded">/interview-notes</code>
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">3. Define Assumptions</h3>
              <p className="text-sm text-muted-foreground">
                Identify what needs validation with <code className="bg-muted px-1 py-0.5 rounded">/add-assumption</code>
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">4. Design Experiments</h3>
              <p className="text-sm text-muted-foreground">
                Test your riskiest assumptions with <code className="bg-muted px-1 py-0.5 rounded">/design-experiment</code>
              </p>
            </div>
          </div>

          <div className="pt-4">
            <Link href="/discovery/projects">
              <Button>View Projects</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Framework Overview */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Opportunity Solution Tree</CardTitle>
            <CardDescription>Map problems to solutions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Start with business goals, identify opportunities, propose solutions, and design experiments to validate them.
            </p>
            <div className="text-xs space-y-2">
              <div>📊 <strong>Goal</strong> → What business outcome?</div>
              <div>🎯 <strong>Outcome</strong> → What user need?</div>
              <div>💡 <strong>Opportunity</strong> → What problem to solve?</div>
              <div>✨ <strong>Solution</strong> → How to solve it?</div>
              <div>🧪 <strong>Experiment</strong> → How to validate?</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assumption Testing</CardTitle>
            <CardDescription>Validate before building</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Classify assumptions by importance and certainty. Test the riskiest first (Important + Unknown).
            </p>
            <div className="text-xs space-y-2">
              <div>🔵 <strong>Value</strong> → Does it create value?</div>
              <div>🟣 <strong>Usability</strong> → Can users use it?</div>
              <div>🟡 <strong>Feasibility</strong> → Can we build it?</div>
              <div className="pt-2">
                <div>🔴 Important + Unknown = TEST FIRST</div>
                <div>🟡 Important + Known = Low risk</div>
                <div>⚪ Unimportant = Don't test</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

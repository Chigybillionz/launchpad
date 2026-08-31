import Link from "next/link";
import { MapPin, Calendar, Globe } from "lucide-react";
import { Opportunity } from "@/types/opportunity";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePathname } from "next/navigation";
import { MatchScore } from "./match-score";

interface OpportunityCardProps {
  opportunity: Opportunity;
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const {
    title,
    organization,
    type,
    location,
    remote,
    deadline,
    matchScore,
    requiredSkills,
  } = opportunity;

  // Format date
  const formattedDeadline = new Date(deadline).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const pathname = usePathname();
  const basePath = pathname.startsWith("/discover") ? "/discover/opportunities" : "/dashboard/opportunities";

  return (
    <Card className="flex h-full flex-col hover:border-primary/50 transition-colors duration-300">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <Badge variant="secondary" className="mb-1 capitalize">
              {type}
            </Badge>
            <CardTitle className="line-clamp-2 text-lg" title={title}>{title}</CardTitle>
            <CardDescription className="text-sm font-medium text-foreground">{organization}</CardDescription>
          </div>
          {matchScore !== undefined && (
            <div className="shrink-0 mt-1">
              <MatchScore score={matchScore} />
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 space-y-4">
        <div className="grid gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            {remote ? <Globe className="size-4 shrink-0" /> : <MapPin className="size-4 shrink-0" />}
            <span className="truncate">{remote ? "Remote" : location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="size-4 shrink-0" />
            <span>Deadline: {formattedDeadline}</span>
          </div>
        </div>

        {requiredSkills && requiredSkills.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Relevant Skills</div>
            <div className="flex flex-wrap gap-1.5">
              {requiredSkills.slice(0, 3).map((skill) => (
                <Badge key={skill} variant="outline" className="text-[10px] py-0 px-1.5 h-4">
                  {skill}
                </Badge>
              ))}
              {requiredSkills.length > 3 && (
                <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-4">
                  +{requiredSkills.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-4 pb-4 flex gap-2">
        <Button 
          render={<Link href={`${basePath}/${opportunity.id}`} />} 
          className="flex-1 shadow-xs hover:shadow-md transition-all duration-300" 
          variant="default"
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}

export interface getBranchesComparative {
  topBranches: TopBranch[];
  difference: number;
}
interface TopBranch {
  branch: string;
  amount: number;
}

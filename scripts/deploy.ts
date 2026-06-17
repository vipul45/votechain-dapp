import { ethers } from "hardhat";

async function main() {
  console.log("Deploying VoteChain contract...");

  const VoteChain = await ethers.getContractFactory("VoteChain");
  const voteChain = await VoteChain.deploy();

  await voteChain.waitForDeployment();

  const address = await voteChain.getAddress();
  console.log(`VoteChain deployed to: ${address}`);

  console.log("Deployment complete!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
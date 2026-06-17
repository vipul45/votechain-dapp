import { expect } from "chai";
import { ethers } from "hardhat";
import { VoteChain } from "../typechain-types";

describe("VoteChain", function () {
  let voteChain: VoteChain;
  let owner: any;
  let voter1: any;
  let voter2: any;

  beforeEach(async function () {
    [owner, voter1, voter2] = await ethers.getSigners();
    
    const VoteChainFactory = await ethers.getContractFactory("VoteChain");
    voteChain = await VoteChainFactory.deploy();
    await voteChain.waitForDeployment();
  });

  it("Should create a poll successfully", async function () {
    const question = "What is your favorite blockchain?";
    const options = ["Ethereum", "Solana", "Polygon"];
    const duration = 86400; // 1 day

    await voteChain.createPoll(question, options, duration);
    
    const poll = await voteChain.getPoll(1);
    expect(poll.question).to.equal(question);
    expect(poll.options.length).to.equal(3);
  });

  it("Should allow voting and track results", async function () {
    const options = ["Yes", "No"];
    await voteChain.createPoll("Test Poll", options, 3600);

    await voteChain.connect(voter1).vote(1, 0);
    await voteChain.connect(voter2).vote(1, 0);

    const results = await voteChain.getPollResults(1);
    expect(results[0]).to.equal(2);
  });

  it("Should prevent double voting", async function () {
    await voteChain.createPoll("Test", ["A", "B"], 3600);
    
    await voteChain.connect(voter1).vote(1, 0);
    
    await expect(
      voteChain.connect(voter1).vote(1, 0)
    ).to.be.revertedWith("You have already voted on this poll");
  });
});
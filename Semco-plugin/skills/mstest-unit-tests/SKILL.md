---
name: mstest-unit-tests
description: Write MSTest unit tests for C# code following team conventions (MSTest + Moq, AAA pattern, MethodName_Scenario_ExpectedResult naming, test project per class library). Use this skill whenever the user asks to write, add, generate, or scaffold unit tests for C# / .NET code, asks to "cover" a class or service with tests, asks to set up a test project, or shares a C# class and wants it tested. Also use when the user mentions MSTest, Moq, test coverage, or regression tests in a .NET context, even if they do not say "unit test" explicitly.
---

# MSTest Unit Tests

Write unit tests for C# business logic using MSTest and Moq. The goal is regression protection: tests should fail when behaviour changes, and only then. Every test must earn its place by protecting a real piece of logic.

## Core principle: test behaviour, not existence

The single most important rule. A test is only valuable if it can catch a real bug. Before writing any test, ask: "what realistic code change would make this test fail, and would that change be a bug?" If the answer is "none" or "no", do not write the test.

**Never write tests like these:**

- Asserting a property returns what the setter stored (testing auto-properties / the compiler)
- Asserting a mock returns what you configured it to return (testing Moq, not your code)
- Asserting a constructor assigns its parameters to fields with no logic involved
- Asserting types ("is a string a string", `Assert.IsInstanceOfType` on obvious returns)
- Duplicate tests that vary input values without exercising a new branch, boundary, or rule (three tests for 10%, 20%, 30% VAT rate when the formula is identical add nothing; one representative case is enough)
- Testing framework or BCL behaviour (LINQ, `DateTime`, serializers)

**Do write tests for:**

- Calculations and transformations (correct result for representative input)
- Branching logic (one test per meaningful branch)
- Boundary values where behaviour changes (zero, negative, empty collection, max values, null when null is a legal or interesting input)
- Exception paths (invalid input throws the expected exception type)
- Interaction logic that matters: the method called its dependency with the right arguments, or the right number of times, when that IS the business rule (use `mock.Verify` sparingly and only for meaningful interactions)

When you finish generating tests for a class, re-read the list and delete anything that fails the "what bug would this catch" check. Fewer, sharper tests beat exhaustive noise. Not every test is clearly good or clearly trivial, though; the self-review step in the workflow explains how to handle the grey zone.

## Project structure and scaffolding

One MSTest project per class library under test, placed in a `Test` folder at solution level. Name it after the library with a `.Test` suffix so ownership is obvious:

```
MySolution/
├── src/
│   ├── MyApp.Application/          (class library under test)
│   └── MyApp.Domain/
└── Test/
    ├── MyApp.Application.Test/
    │   ├── MyApp.Application.Test.csproj
    │   └── Services/
    │       └── VATServiceTests.cs
    └── MyApp.Domain.Test/
```

In Onion/Clean architecture, the Test layer sits at the same level as Infrastructure or Presentation: it references inward, nothing references it.

Mirror the folder structure of the library under test inside the test project (a service in `Services/` gets its tests in `Services/`). One test class per production class, named `<ClassName>Tests`.

### Creating the test project

When scaffolding, match the target framework of the library under test (check its csproj first). Prefer the CLI when available:

```bash
dotnet new mstest -n MyApp.Application.Test -o Test/MyApp.Application.Test
dotnet add Test/MyApp.Application.Test package Moq
dotnet add Test/MyApp.Application.Test reference src/MyApp.Application/MyApp.Application.csproj
dotnet sln add Test/MyApp.Application.Test
```

If writing the csproj by hand, this is the minimal shape (adjust `TargetFramework` and versions to match the solution):

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>enable</Nullable>
    <IsPackable>false</IsPackable>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="MSTest" Version="3.*" />
    <PackageReference Include="Moq" Version="4.*" />
  </ItemGroup>
  <ItemGroup>
    <ProjectReference Include="..\..\src\MyApp.Application\MyApp.Application.csproj" />
  </ItemGroup>
</Project>
```

The `MSTest` metapackage bundles the framework, adapter, and runner. Do not add coverage or reporting packages unless asked.

## Test naming

`MethodName_Scenario_ExpectedResult`. All three parts, always. Without the scenario part, names collide as soon as a method needs a second test, and failures in CI become unreadable.

```
CalculateVAT_StandardRate_ReturnsPriceWithVATAdded
CalculateVAT_NegativePrice_ThrowsArgumentException
CalculateVAT_ZeroPrice_ReturnsZero
GetCustomer_CustomerNotFound_ReturnsNull
```

The name should let a reader understand the failure without opening the test.

## Test structure: Arrange-Act-Assert

Every test follows AAA with explicit comments. This keeps tests scannable and forces one behaviour per test.

1. **Arrange**: set up inputs, mocks, and the system under test.
2. **Act**: one call to the method under test, capture the result.
3. **Assert**: verify the result (and mock interactions only when the interaction is the behaviour).

One logical behaviour per test. Multiple `Assert` calls are fine when they verify facets of the same behaviour (e.g., several properties of one returned object), but do not chain unrelated scenarios into one test.

## Mocking with Moq

Unit tests isolate the class under test. Mock every dependency the class takes through its constructor; never let a test touch a database, file system, clock, HTTP endpoint, or another concrete service.

- Depend on interfaces; if the production class takes a concrete dependency that cannot be mocked, point this out to the user rather than working around it with fragile tricks.
- Set up only the members the test actually uses. `MockBehavior.Loose` (the default) is fine.
- Use `mock.Verify` only when the interaction is the business rule (e.g., "sends exactly one email"). Verifying every call couples tests to implementation details and makes refactoring painful.
- If a class needs the current time, and it takes a `TimeProvider` or clock abstraction, mock that. If it calls `DateTime.Now` directly, flag it as a testability problem.

## Full example

Production class:

```csharp
public class VATService
{
    private readonly IVATRateProvider _rateProvider;

    public VATService(IVATRateProvider rateProvider)
    {
        _rateProvider = rateProvider;
    }

    public decimal CalculateVAT(decimal price, string countryCode)
    {
        if (price < 0)
            throw new ArgumentException("Price cannot be negative.", nameof(price));

        var rate = _rateProvider.GetRate(countryCode);
        return price * (1 + rate);
    }
}
```

Test class:

```csharp
[TestClass]
public class VATServiceTests
{
    private Mock<IVATRateProvider> _rateProviderMock = null!;
    private VATService _sut = null!;

    [TestInitialize]
    public void Setup()
    {
        _rateProviderMock = new Mock<IVATRateProvider>();
        _sut = new VATService(_rateProviderMock.Object);
    }

    [TestMethod]
    public void CalculateVAT_StandardRate_ReturnsPriceWithVATAdded()
    {
        // Arrange
        _rateProviderMock.Setup(p => p.GetRate("DK")).Returns(0.25m);

        // Act
        var result = _sut.CalculateVAT(100m, "DK");

        // Assert
        Assert.AreEqual(125m, result);
    }

    [TestMethod]
    public void CalculateVAT_ZeroPrice_ReturnsZero()
    {
        // Arrange
        _rateProviderMock.Setup(p => p.GetRate("DK")).Returns(0.25m);

        // Act
        var result = _sut.CalculateVAT(0m, "DK");

        // Assert
        Assert.AreEqual(0m, result);
    }

    [TestMethod]
    public void CalculateVAT_NegativePrice_ThrowsArgumentException()
    {
        // Arrange
        var negativePrice = -1m;

        // Act & Assert
        Assert.ThrowsException<ArgumentException>(
            () => _sut.CalculateVAT(negativePrice, "DK"));
    }
}
```

Note what is NOT tested: that `GetRate` returns 0.25 (that is the mock), that the constructor stores the provider, or a third rate value like 0.19 (same branch as 0.25, adds nothing). Use `Assert.ThrowsExactly` instead of `Assert.ThrowsException` on MSTest 3.8+ if the project already uses it.

For data-driven cases where multiple inputs DO cover different rules (not just different values), prefer `[DataTestMethod]` with `[DataRow]` over copy-pasted tests.

## Workflow when asked to write tests

1. Read the class under test fully, including the interfaces it depends on. If dependency interfaces are not provided, ask for them or infer minimal signatures and say you did so.
2. Identify the behaviours worth testing: list branches, boundaries, and exception paths mentally before writing.
3. Check whether a test project already exists for that library. If yes, add to it, matching its existing style and package versions. If no, scaffold one as described above.
4. Write the tests, AAA, one behaviour each.
5. Self-review (see below).
6. If a `dotnet` CLI is available, build and run the tests (`dotnet test`) and fix failures before delivering.

## Self-review before delivering

After writing the tests, go through them one final time and sort each into one of three buckets:

**Clearly valuable** (protects a branch, rule, or exception path): keep, say nothing.

**Clearly trivial** (fails the "what bug would this catch" check, matches a forbidden pattern): delete silently. Do not ask the user for permission to remove noise.

**Borderline**: keep the test in the delivered code, but flag it to the user at the end of the response and ask whether they want it. Common borderline patterns:

- Boundary tests where the boundary is real but unlikely to regress (e.g., a test at exactly the threshold value when the above-threshold branch is already tested)
- Multiple tests covering different conditions of the same guard clause (e.g., separate null and empty-collection tests for `if (x is null || x.Count == 0)`)
- `mock.Verify` assertions where the interaction is arguably behaviour, arguably implementation detail
- Tests for very thin logic (simple string formatting, single-field mapping) that is real logic but cheap to eyeball

Flag them briefly, one line per test, with the tradeoff. For example:

> Two tests are borderline, tell me if you want them removed:
> - `ApplyDiscount_DiscountedTotalExactly10000_DoesNotApplyExtraDiscount`: real boundary (> vs >=), but the branch itself is already covered.
> - `CalculateTotal_NullLines_ThrowsArgumentException`: same guard clause as the empty-list test, covers the other side of the ||.

Keeping borderline tests in the code (rather than leaving them out and asking) means the user can accept by doing nothing, which is the common case. Do not flag more than a handful; if everything feels borderline, the behaviour analysis in step 2 was too shallow, redo it.

If the class under test has no logic (pure DTOs, records, empty wrappers), say so and do not generate tests for it. An honest "this does not need unit tests" is better output than filler tests.